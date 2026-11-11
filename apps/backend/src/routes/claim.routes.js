const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claim.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { handleClaimProofUpload } = require('../middlewares/upload.middleware');

// Gửi yêu cầu nhận đồ kèm bằng chứng riêng (cho phép đính kèm ảnh minh chứng)
router.post('/items/:id/claims', verifyToken, handleClaimProofUpload, claimController.createClaim);

// Xem danh sách yêu cầu nhận đồ của chính mình (đặt trước /claims/:id)
router.get('/claims/my', verifyToken, claimController.getMyClaims);

// Xem toàn bộ danh sách yêu cầu (Chỉ Admin/Moderator)
router.get('/claims', verifyToken, requireRole('ADMIN', 'MODERATOR'), claimController.getAllClaims);

// Xem chi tiết 1 claim (Chỉ chủ Claim hoặc Admin/Moderator)
router.get('/claims/:id', verifyToken, claimController.getClaimById);

// Đọc bằng chứng đối chiếu riêng (Proof Privacy - Chỉ chủ Claim hoặc Admin/Moderator)
router.get('/claims/:id/proofs', verifyToken, claimController.getClaimProofs);

// Xác nhận bàn giao thực tế & đóng tin (Chống double-handover - Chỉ Admin/Moderator)
router.post(
  '/claims/:id/handover',
  verifyToken,
  requireRole('ADMIN', 'MODERATOR'),
  claimController.completeHandover
);

// Từ chối yêu cầu nhận đồ (Chỉ Admin/Moderator)
router.post(
  '/claims/:id/reject',
  verifyToken,
  requireRole('ADMIN', 'MODERATOR'),
  claimController.rejectClaim
);

// Người gửi tự rút yêu cầu khi đang PENDING
router.post('/claims/:id/withdraw', verifyToken, claimController.withdrawClaim);

module.exports = router;
