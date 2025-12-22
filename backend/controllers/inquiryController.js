const Inquiry = require("../model/Inquiry");
const response = require("../utils/responseHandler");

// Tạo thắc mắc mới
const createInquiry = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return response(res, 400, "Vui lòng điền đầy đủ thông tin.");

        const userId = req.user.userId;
        if (!userId) return response(res, 401, "Bạn cần đăng nhập để gửi thắc mắc.");

        const newInquiry = new Inquiry({ userId, message });
        await newInquiry.save();

        return response(res, 201, "Thắc mắc đã được gửi!", newInquiry);
    } catch (error) {
        return response(res, 500, "Lỗi server", error.message);
    }
};

module.exports = {
    createInquiry
};