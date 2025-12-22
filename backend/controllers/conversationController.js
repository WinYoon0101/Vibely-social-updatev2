const Conversation = require('../model/Conversation');

// Tạo cuộc trò chuyện mới
const createConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Thiếu senderId hoặc receiverId" });
        }

        // Kiểm tra xem đã có cuộc trò chuyện giữa 2 người chưa
        const existingConversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
            $expr: { $eq: [{ $size: "$members" }, 2] } // kiểm tra đúng 2 thành viên
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        // Nếu chưa có thì tạo mới
        const newConversation = new Conversation({
            members: [senderId, receiverId],
        });

        const savedConversation = await newConversation.save();
        return res.status(200).json(savedConversation);
    } catch (err) {
        console.error("Lỗi khi tạo cuộc trò chuyện:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Lấy danh sách cuộc trò chuyện của một người dùng
const getUserConversations = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const conversations = await Conversation.find({
            members: { $in: [userId] },
        });

        return res.status(200).json(conversations);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách cuộc trò chuyện:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Lấy cuộc trò chuyện giữa hai người dùng
const getConversationBetweenUsers = async (req, res) => {
    try {
        const { firstUserId, secondUserId } = req.params;

        if (!firstUserId || !secondUserId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }

        const conversation = await Conversation.findOne({
            members: { $all: [firstUserId, secondUserId] },
        });

        return res.status(200).json(conversation);
    } catch (err) {
        console.error("Lỗi khi lấy cuộc trò chuyện giữa hai người dùng:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Thay đổi biệt danh 
const changeNickname = async (req, res) => {
    try {
        const { conversationId, userId, nickname } = req.body;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
        }

        // Kiểm tra và khởi tạo nicknames nếu chưa tồn tại
        if (!conversation.nicknames) {
            conversation.nicknames = new Map();
        }

        conversation.nicknames.set(userId, nickname);
        await conversation.save();

        return res.status(200).json({ message: "Đặt biệt danh thành công" });
    } catch (err) {
        console.error("Không thể đặt biệt danh:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};
// Xóa cuộc trò chuyện
const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        await Conversation.findByIdAndDelete(conversationId);

        return res.status(200).json({ message: "Xóa cuộc trò chuyện thành công" });
    } catch (err) {
        console.error("Không thể xóa cuộc trò chuyện:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Lấy biệt danh của một người dùng trong cuộc trò chuyện
const getNickname = async (req, res) => {
    try {
        const { conversationId, userId } = req.params;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
        }

        // Kiểm tra xem nicknames có tồn tại không
        if (!conversation.nicknames) {
            return res.status(200).json({ nickname: null });
        }

        // Lấy biệt danh của người dùng
        const nickname = conversation.nicknames.get(userId);

        return res.status(200).json({ nickname });
    } catch (err) {
        console.error("Không thể lấy biệt danh:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Đổi màu đoạn chat
const changeColor = async (req, res) => {
    try {
        const { conversationId, color } = req.body;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
        }

        conversation.color = color;
        await conversation.save();

        return res.status(200).json({ message: "Đổi màu đoạn chat thành công" });
    } catch (err) {
        console.error("Không thể đổi màu đoạn chat:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

module.exports = { createConversation, getUserConversations, getConversationBetweenUsers, changeNickname, deleteConversation, getNickname, changeColor };
