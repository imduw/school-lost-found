const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// Đăng ký tài khoản USER mới
router.post('/register', authController.register);

// Đăng nhập lấy JWT token
router.post('/login', authController.login);

// Đăng xuất (thu hồi token hiện tại)
router.post('/logout', verifyToken, authController.logout);

// Lấy thông tin tài khoản hiện tại
router.get('/me', verifyToken, authController.getMe);

// Endpoint kiểm tra nhanh phân quyền Admin/Moderator (dành cho test TC01)
router.get('/admin-check', verifyToken, requireRole('ADMIN', 'MODERATOR'), (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Xác nhận bạn có quyền Quản trị viên / Moderator hợp lệ',
      role: req.user.role,
    },
  });
});

module.exports = router;
