const Message = require('../model/Message');
const Conversation = require('../model/Conversation');

// Thêm tin nhắn mới
const addMessage = async (req, res) => {
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Lấy tin nhắn theo conversationId
const getMessagesByConversationId = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Đánh dấu tin nhắn đã đọc
const markMessageAsRead = async (req, res) => {
    try {
        const { messageId, userId } = req.body;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ message: "Không tìm thấy tin nhắn" });
        }

        // Nếu userId chưa có trong readBy và không phải người gửi
        if (!message.readBy.includes(userId) && message.sender.toString() !== userId) {
            message.readBy.push(userId);
            message.isRead = true; // Set isRead = true khi người nhận đọc tin nhắn
            await message.save();

            // Emit sự kiện messageRead qua socket
            req.app.get('io').emit("messageRead", {
                messageId: message._id,
                userId: userId,
                isRead: true
            });
        }

        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
}

// Lấy số tin nhắn chưa đọc của một người dùng
const getUnreadMessageCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({
            readBy: { $nin: [userId] },
            sender: { $ne: userId }
        });

        // Nhóm số tin nhắn chưa đọc theo conversationId
        const unreadCounts = messages.reduce((acc, message) => {
            if (!acc[message.conversationId]) {
                acc[message.conversationId] = 0;
            }
            acc[message.conversationId]++;
            return acc;
        }, {});

        const totalUnread = messages.length;

        res.status(200).json({
            total: totalUnread,
            byConversation: unreadCounts
        });
    } catch (err) {
        res.status(500).json(err);
    }
}

// Lấy tin nhắn cuối cùng của mỗi cuộc trò chuyện
const getLastMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const conversations = await Message.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$conversationId",
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    addMessage,
    getMessagesByConversationId,
    markMessageAsRead,
    getUnreadMessageCount,
    getLastMessages
};