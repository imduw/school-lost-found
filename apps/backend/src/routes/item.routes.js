const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { verifyToken, optionalAuth } = require('../middlewares/auth.middleware');

// Lấy danh sách danh mục
router.get('/categories', itemController.getCategories);

// Tìm kiếm & lọc danh sách tin (ẩn tin HIDDEN với người ngoài quyền)
router.get('/items', optionalAuth, itemController.getItems);

// Xem chi tiết 1 tin (chặn 403 nếu tin bị ẩn với người ngoài quyền)
router.get('/items/:id', optionalAuth, itemController.getItemById);

// Tạo tin đăng mới (bắt buộc đăng nhập)
router.post('/items', verifyToken, itemController.createItem);

// Sửa tin mở của chính mình
router.put('/items/:id', verifyToken, itemController.updateItem);

// Chủ tin báo mất tự đánh dấu đã tìm thấy (OPEN -> RESOLVED)
router.patch('/items/:id/resolve', verifyToken, itemController.resolveLostItem);

module.exports = router;
