const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả các route đều yêu cầu xác thực
router.use(authMiddleware);

// Route để xử lý tin nhắn
router.post('/handleMessage', chatbotController.handleMessage);

// Route để lấy lịch sử chat
router.get('/history', chatbotController.getChatHistory);

// Route để xóa lịch sử chat
router.delete('/history', chatbotController.deleteChatHistory);

// Route để tạo cuộc hội thoại mới
router.post('/', chatbotController.createChat);

// Route để lấy danh sách cuộc hội thoại
router.get('/', chatbotController.getChats);

// Route để lấy chi tiết một cuộc hội thoại
router.get('/:chatId', chatbotController.getChatItem);

// Route để thêm câu hỏi vào cuộc hội thoại
router.put('/:chatId', chatbotController.putQuestion);

// Route để xử lý streaming response
router.post('/stream', chatbotController.streamChatbotResponse);

module.exports = router;