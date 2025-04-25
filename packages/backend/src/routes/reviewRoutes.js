const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

// Lưu trữ ảnh review trong thư mục riêng
const reviewImagesUpload = upload.array('images', 3); // Tối đa 3 ảnh

// Các routes cho review

// Lấy tất cả review của một sản phẩm
router.get('/dress/:dressId/review', reviewController.getDressReviews);

// Thêm review mới (yêu cầu đăng nhập)
router.post('/dress/:dressId/review', authMiddleware, reviewImagesUpload, reviewController.createReview);

// Thêm reply vào review (yêu cầu đăng nhập)
router.post('/dress/:dressId/review/:reviewId/reply', authMiddleware, reviewController.addReplyToReview);

// Xóa review (yêu cầu là chủ sở hữu hoặc admin)
router.delete('/review/:reviewId', authMiddleware, reviewController.deleteReview);

module.exports = router; 