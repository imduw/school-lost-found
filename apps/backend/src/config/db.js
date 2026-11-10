const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Bắt buộc phải có để kết nối qua SSL an toàn với Supabase
  }
});

// Test kết nối ngay khi khởi động
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Lỗi kết nối Supabase:', err.message);
  } else {
    console.log('Kết nối Supabase PostgreSQL thành công lúc:', res.rows[0].now);
  }
});

module.exports = pool;