const express = require('express');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { getAllPosts, getPostByUserId, deletePost, deleteComment, deleteReply, getSinglePost } = require('../controllers/adminPostController');
const router = express.Router();

// Route lấy tất cả các bài viết
router.get('/posts', adminAuthMiddleware, getAllPosts);

// Route lấy bài viết theo ID
router.get('/:postId', adminAuthMiddleware, getSinglePost);

// Route lấy bài viết theo ID người dùng
router.get('/user/:id', adminAuthMiddleware, getPostByUserId);

// Route xóa bài viết, bình luận và phản hồi
router.delete('/deletePost/:postId', adminAuthMiddleware, deletePost);
router.delete('/deleteComment/:postId/:commentId', adminAuthMiddleware, deleteComment);
router.delete('/deleteReply/:postId/:commentId/:replyId', adminAuthMiddleware, deleteReply);

module.exports = router;