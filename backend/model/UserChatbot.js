const mongoose = require('mongoose');

//Schema lưu danh sách cuộc trò chuyện của mỗi người dùng
const UserChatbotSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chats: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Chatbot',
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('UserChatbot', UserChatbotSchema);