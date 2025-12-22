const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../config/cloudinary');
const { createPost, getAllPosts, getPostByUserId, reactPost, addCommentToPost, sharePost, createStory, getAllStories, reactStory, addReplyToPost, deletePost, deleteComment, deleteReply, getSinglePost, likeComment, editPost, deleteStory } = require('../controllers/postController');
const router = express.Router();


// Route tạo bài viết mới
router.post('/posts', authMiddleware, multerMiddleware.single('media'), createPost);

// Route lấy tất cả các bài viết
router.get('/posts', authMiddleware, getAllPosts);

// Route lấy bài viết theo ID
router.get('/posts/:postId', authMiddleware, getSinglePost);

// Route lấy bài viết theo ID người dùng
router.get('/posts/user/:id', authMiddleware, getPostByUserId);

// Route lấy bài viết theo ID người dùng
router.post('/posts/reacts/:postId', authMiddleware, reactPost);

// Route thêm bình luận vào bài viết
router.post('/posts/comments/:postId', authMiddleware, addCommentToPost);

// Route chia sẻ bài viết
router.post('/posts/share/:postId', authMiddleware, sharePost);

// Route tạo story mới
router.post('/story', authMiddleware, multerMiddleware.single('media'), createStory);

// Route lấy tất cả các story
router.get('/story', authMiddleware, getAllStories);

// Route lấy story theo ID
router.post('/story/reacts/:storyId', authMiddleware, reactStory);

// Route thêm phản hồi vào bình luận
router.post('/posts/reply/:postId', authMiddleware, addReplyToPost);

// Route xóa bài viết, bình luận và phản hồi
router.delete('/posts/deletePost/:postId', authMiddleware, deletePost);
router.delete('/posts/deleteComment/:postId/:commentId', authMiddleware, deleteComment);
router.delete('/posts/deleteReply/:postId/:commentId/:replyId', authMiddleware, deleteReply);

// Route thích bình luận
router.post('/posts/reactComment/:postId', authMiddleware, likeComment);

// Route chỉnh sửa bài viết
router.put('/posts/edit/:postId', authMiddleware, multerMiddleware.single('media'), editPost);

// Route xóa story
router.delete('/posts/deleteStory/:storyId', authMiddleware, deleteStory);

module.exports = router;