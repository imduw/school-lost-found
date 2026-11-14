const { createRequire } = require('node:module');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const backendRequire = createRequire(path.resolve(__dirname, '../../backend/package.json'));
const { Pool } = backendRequire('pg');
const bcrypt = backendRequire('bcryptjs');
const root = path.resolve(__dirname, '../../..');

function testPool() {
  const value = process.env.CYPRESS_TEST_DATABASE_URL;
  if (!value) throw new Error('Run npm run test:e2e to create an isolated test database.');
  const url = new URL(value);
  if (url.hostname !== '127.0.0.1' || url.pathname !== '/slf_cypress' || url.username !== 'slf_test') {
    throw new Error('Refusing to reset a database outside the disposable Cypress environment.');
  }
  return new Pool({ connectionString: value, connectionTimeoutMillis: 3000 });
}

async function initialize() {
  const pool = testPool();
  try { await pool.query(readFileSync(path.join(root, 'database/schema.sql'), 'utf8')); }
  finally { await pool.end(); }
}

async function reset() {
  const pool = testPool();
  try {
    await pool.query('TRUNCATE audit_logs, handovers, claim_proofs, claims, item_images, items, users, categories RESTART IDENTITY CASCADE');
    await pool.query(readFileSync(path.join(root, 'database/seed.sql'), 'utf8'));
    const hash = await bcrypt.hash('Test@123456', 10);
    const users = [[1, 'admin', 'Quản trị kiểm thử', 'ADMIN'], [2, 'other', 'Người dùng B', 'USER'],
      [3, 'moderator', 'Cán bộ kiểm thử', 'MODERATOR'], [4, 'owner', 'Người đăng kiểm thử', 'USER'],
      [5, 'claimant', 'Người nhận kiểm thử', 'USER']];
    for (const [id, account, name, role] of users) {
      await pool.query('UPDATE users SET email=$1, full_name=$2, role=$3, password_hash=$4, student_id=$5, phone=NULL WHERE id=$6',
        [`${account}@slf.test`, name, role, hash, `TEST00${id}`, id]);
    }
    await pool.query("INSERT INTO users(email,password_hash,full_name,role,status) VALUES ('suspended@slf.test',$1,'Tài khoản khóa','USER','SUSPENDED')", [hash]);
    await pool.query("UPDATE items SET title=CASE id WHEN 1 THEN 'Ví da kiểm thử' WHEN 2 THEN 'Thẻ sinh viên kiểm thử' WHEN 3 THEN 'Tai nghe đã bàn giao' ELSE 'Bình nước tin ẩn' END, description='Mô tả công khai dùng riêng cho Cypress'");
    await pool.query("UPDATE claim_proofs SET proof_content='BẰNG CHỨNG GIẢ LẬP CYPRESS ' || id");
    await pool.query("UPDATE claims SET note=NULL; UPDATE handovers SET note='Bàn giao giả lập'; UPDATE audit_logs SET details='Dữ liệu kiểm thử Cypress', ip_address='127.0.0.1'");
    await pool.query("INSERT INTO items(user_id,category_id,item_type,title,description,approximate_location,occurred_at,publication_status) VALUES (4,2,'FOUND','Laptop chờ duyệt','Mô tả kiểm thử','Thư viện',NOW(),'PENDING_REVIEW'),(4,2,'FOUND','Điện thoại bị từ chối','Mô tả kiểm thử','Thư viện',NOW(),'REJECTED')");
    return null;
  } finally { await pool.end(); }
}

async function snapshot() {
  const pool = testPool();
  try {
    const output = {};
    for (const table of ['items', 'claims', 'handovers', 'audit_logs']) {
      output[table] = (await pool.query(`SELECT * FROM ${table} ORDER BY id`)).rows;
    }
    return output;
  } finally { await pool.end(); }
}

module.exports = { initialize, reset, snapshot };
