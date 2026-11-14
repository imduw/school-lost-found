import { spawn, execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdirSync, createWriteStream, readdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(web, '../..');
const require = createRequire(import.meta.url);
const container = `slf-cypress-${process.pid}-${randomBytes(3).toString('hex')}`;
const password = randomBytes(24).toString('hex');
const children = [];
const logStreams = [];
const uploads = ['items', 'proofs'].map(folder => path.join(root, 'apps/backend/uploads', folder));
const originalUploads = new Set(uploads.flatMap(folder => {
  try { return readdirSync(folder).map(name => path.join(folder, name)); } catch { return []; }
}));
let startedContainer = false;
let cleaned = false;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

async function freePort(port) {
  await new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () => reject(new Error(`Port ${port} is occupied; stop the existing dev server before testing.`)));
    server.listen(port, () => server.close(resolve));
  });
}
async function cleanup() {
  if (cleaned) return;
  cleaned = true;
  for (const child of children) child.kill('SIGTERM');
  await Promise.all(children.map(child => child.exitCode !== null ? Promise.resolve() : new Promise(resolve => {
    const timeout = setTimeout(() => { child.kill('SIGKILL'); resolve(); }, 3000);
    child.once('exit', () => { clearTimeout(timeout); resolve(); });
  })));
  for (const stream of logStreams) stream.end();
  if (startedContainer) docker('stop', '-t', '2', container);
  for (const folder of uploads) {
    let names = [];
    try { names = readdirSync(folder); } catch { /* no uploads */ }
    for (const name of names) {
      const file = path.join(folder, name);
      if (!originalUploads.has(file) && /^(item|proof)-\d+-\d+\./.test(name)) unlinkSync(file);
    }
  }
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { cleanup().finally(() => process.exit(130)); });
function start(command, args, cwd, name) {
  const output = createWriteStream(path.join(web, 'cypress/results', `${name}.log`));
  const child = spawn(command, args, { cwd, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.pipe(output); child.stderr.pipe(output);
  children.push(child); logStreams.push(output);
  return child;
}
async function ready(url, child) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw new Error(`Server exited. See cypress/results/*.log (${url}).`);
    try { if ((await fetch(url)).ok) return; } catch { /* starting */ }
    await pause(500);
  }
  throw new Error(`Server did not become ready: ${url}`);
}

try {
  await freePort(5000); await freePort(5173);
  mkdirSync(path.join(web, 'cypress/results'), { recursive: true });
  console.log('Creating disposable PostgreSQL 16 database…');
  docker('run', '--rm', '-d', '--name', container, '-p', '127.0.0.1::5432',
    '-e', 'POSTGRES_USER=slf_test', '-e', `POSTGRES_PASSWORD=${password}`, '-e', 'POSTGRES_DB=slf_cypress', 'postgres:16-alpine');
  startedContainer = true;
  const port = docker('port', container, '5432/tcp').split(':').at(-1);
  process.env.CYPRESS_TEST_DATABASE_URL = `postgresql://slf_test:${password}@127.0.0.1:${port}/slf_cypress?sslmode=disable`;
  process.env.DATABASE_URL = process.env.CYPRESS_TEST_DATABASE_URL;
  process.env.JWT_SECRET = randomBytes(32).toString('hex');
  process.env.PORT = '5000';
  process.env.VITE_API_URL = '/api/v1';
  // VS Code/Electron may export this; Cypress must launch its browser normally.
  delete process.env.ELECTRON_RUN_AS_NODE;
  for (let i = 0; i < 60; i++) {
    try { docker('exec', container, 'pg_isready', '-U', 'slf_test', '-d', 'slf_cypress'); break; }
    catch { if (i === 59) throw new Error('PostgreSQL startup timed out'); await pause(500); }
  }
  const db = require('./e2e-db.cjs');
  // pg_isready can succeed for the temporary server used by the image's init script.
  // Retry TCP setup while that server is replaced by the final PostgreSQL process.
  for (let attempt = 0; ; attempt++) {
    try { await db.initialize(); await db.reset(); break; }
    catch (error) {
      const transient = /Connection terminated|ECONNREFUSED|ECONNRESET|starting up/.test(error.message);
      if (!transient || attempt >= 30) throw error;
      await pause(500);
    }
  }
  const backend = start(process.execPath, ['src/server.js'], path.join(root, 'apps/backend'), 'backend');
  const frontend = start(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--strictPort'], web, 'frontend');
  await ready('http://127.0.0.1:5000/api/v1/health', backend);
  await ready('http://127.0.0.1:5173', frontend);
  const cypress = require('cypress');
  const specIndex = process.argv.indexOf('--spec');
  const result = await cypress.run({ project: web, browser: 'chrome',
    ...(specIndex >= 0 ? { spec: process.argv[specIndex + 1] } : {}) });
  process.exitCode = result.failures || result.totalFailed || result.totalSkipped ? 1 : 0;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally { await cleanup(); }
