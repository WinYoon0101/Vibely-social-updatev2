const express = require('express');
const router = express.Router();
const { createConversation, getUserConversations, getConversationBetweenUsers, changeNickname, deleteConversation, getNickname, changeColor } = require('../controllers/conversationController');

// Route tạo cuộc trò chuyện
router.post('/', createConversation);

// Route lấy danh sách cuộc trò chuyện của người dùng
router.get('/:userId', getUserConversations);

// Route lấy cuộc trò chuyện giữa hai người dùng
router.get('/find/:firstUserId/:secondUserId', getConversationBetweenUsers);

// Route thay đổi biệt danh trong cuộc trò chuyện
router.put('/nickname', changeNickname);

// Route xóa cuộc trò chuyện
router.delete('/:conversationId', deleteConversation);

// Route lấy biệt danh trong cuộc trò chuyện
router.get('/nickname/:conversationId/:userId', getNickname);

// Route thay đổi màu sắc trong cuộc trò chuyện
router.put('/color', changeColor);

module.exports = router;
