const path = require('path');
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

// 1. Middlewares cơ bản & Static file cho ảnh upload
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// 2. Route trang chủ mặc định kiểm tra API server
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'School Lost & Found API Server is running',
      healthCheck: '/api/v1/health',
      apiPrefix: '/api/v1',
    },
  });
});

// 3. Endpoint kiểm tra trạng thái server & database (Health Check)
app.get('/api/v1/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW() AS server_time');
    return res.status(200).json({
      success: true,
      data: {
        status: 'UP',
        service: 'school-lost-found-backend',
        database: 'CONNECTED',
        timestamp: dbResult.rows[0].server_time,
      },
    });
  } catch (error) {
    console.error('Health check database error:', error.message);
    return res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Không thể kết nối đến cơ sở dữ liệu Supabase',
      },
    });
  }
});

// 3. Gắn các cụm API Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1', require('./routes/item.routes'));
// app.use('/api/v1', require('./routes/claim.routes'));

// 4. Xử lý 404 khi gọi sai đường dẫn (Tương thích Express 5)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Không tìm thấy đường dẫn ${req.method} ${req.originalUrl}`,
    },
  });
});

// 5. Global Error Handler bắt lỗi tập trung
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Đã xảy ra lỗi hệ thống nội bộ',
    },
  });
});

module.exports = app;
