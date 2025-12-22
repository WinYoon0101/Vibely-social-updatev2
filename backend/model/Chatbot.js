const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'model']
    },
    parts: [{
        text: {
            type: String,
            required: true
        }
    }]
});

const chatbotSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    history: [chatHistorySchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chatbot', chatbotSchema);