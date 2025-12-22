const express = require('express');
const {
    addMessage,
    getMessagesByConversationId,
    markMessageAsRead,
    getUnreadMessageCount,
    getLastMessages
} = require('../controllers/messageController');
const router = express.Router();

// Route thêm tin nhắn mới
router.post('/', addMessage);

// Route lấy tin nhắn theo conversationId
router.get('/:conversationId', getMessagesByConversationId);

// Route đánh dấu tin nhắn đã đọc
router.post('/read', markMessageAsRead);

// Route lấy số tin nhắn chưa đọc của user
router.get('/unread/:userId', getUnreadMessageCount);

// Route lấy tin nhắn cuối cùng của mỗi cuộc trò chuyện
router.get('/last/:userId', getLastMessages);

module.exports = router;