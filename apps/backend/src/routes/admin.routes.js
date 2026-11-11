const express = require('express');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  getAuditLogs,
} = require('../controllers/admin.controller');

const router = express.Router();

// Dashboard & Thống kê tổng quan
router.get('/stats', verifyToken, requireRole('ADMIN', 'MODERATOR'), getDashboardStats);

// Quản lý người dùng (chỉ ADMIN)
router.get('/users', verifyToken, requireRole('ADMIN'), getUsers);
router.patch('/users/:id/role', verifyToken, requireRole('ADMIN'), updateUserRole);
router.patch('/users/:id/status', verifyToken, requireRole('ADMIN'), updateUserStatus);

// Quản lý danh mục vật phẩm
router.get('/categories', verifyToken, requireRole('ADMIN', 'MODERATOR'), getAllCategories);
router.post('/categories', verifyToken, requireRole('ADMIN'), createCategory);
router.put('/categories/:id', verifyToken, requireRole('ADMIN'), updateCategory);

// Nhật ký kiểm toán hệ thống (Audit Logs)
router.get('/audit-logs', verifyToken, requireRole('ADMIN', 'MODERATOR'), getAuditLogs);

module.exports = router;
