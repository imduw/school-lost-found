const { defineConfig } = require('cypress');
const path = require('node:path');
const db = require('./scripts/e2e-db.cjs');
const { writeReport } = require('./scripts/e2e-report.cjs');

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 1000,
  video: false,
  screenshotOnRunFailure: true,
  screenshotsFolder: '../../docs/05-giam-sat/cypress/screenshots',
  retries: 0,
  allowCypressEnv: false,
  defaultCommandTimeout: 8000,
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // Keep the disposable database password in Node; never expose it to the browser.
      delete config.env.TEST_DATABASE_URL;
      const cases = {};
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.isHeadless) {
          launchOptions.args.push('--window-size=1920,1200', '--force-device-scale-factor=1');
        }
        return launchOptions;
      });
      on('task', {
        'db:reset': db.reset,
        'db:snapshot': db.snapshot,
        'case:record'(record) { cases[record.id] = record; return null; },
        async 'api:race'({ token, ids }) {
          return Promise.all(ids.map(async id => {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/claims/${id}/handover`, {
              method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ note: 'Cypress race test' }),
            });
            return { status: response.status, body: await response.json() };
          }));
        },
      });
      on('after:run', results => writeReport(results, cases, path.resolve(__dirname, '../..')));
      return config;
    },
  },
});
