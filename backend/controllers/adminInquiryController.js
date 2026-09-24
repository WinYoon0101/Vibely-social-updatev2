const Inquiry = require("../model/Inquiry");
const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const { Resend } = require("resend");
const getEmailTemplate = require("../utils/emailTemplate");

// Khởi tạo Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Lấy tất cả các yêu cầu hỗ trợ
const getInquiries = asyncHandler(async (req, res) => {
    const { query, status } = req.query;
    let filter = {};

    // Filter by status if provided
    if (status) {
        filter.status = status;
    }

    // Search by message or user details if query provided
    if (query) {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("_id");

        const userIds = users.map(user => user._id);

        filter.$or = [
            { message: { $regex: query, $options: "i" } },
            { subject: { $regex: query, $options: "i" } },
            { userId: { $in: userIds } }
        ];
    }

    const inquiries = await Inquiry.find(filter)
        .populate("userId", "username email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: inquiries
    });
});

// Câp nhật trạng thái và phản hồi cho yêu cầu hỗ trợ
const updateInquiry = asyncHandler(async (req, res) => {
    const { status, response } = req.body;
    const inquiry = await Inquiry.findById(req.params.id).populate("userId", "email");

    if (!inquiry) {
        res.status(404);
        throw new Error("Inquiry not found");
    }

    if (status) {
        inquiry.status = status;
    }

    if (response) {
        inquiry.response = response;
        inquiry.respondedAt = Date.now();

        const htmlContent = getEmailTemplate(
            'Phản hồi từ đội ngũ hỗ trợ Vibely',
            `Phản hồi cho yêu cầu: ${inquiry.subject}`,
            `
            <p>Chào bạn,</p>
            <p>Cảm ơn bạn đã liên hệ với đội ngũ hỗ trợ của <strong>Vibely Social</strong>. Dưới đây là phản hồi cho yêu cầu <em>"${inquiry.subject}"</em> của bạn:</p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #23CAF1; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${response}</p>
            </div>
            <p>Nếu bạn có bất kỳ câu hỏi nào khác, đừng ngần ngại gửi thêm yêu cầu hỗ trợ mới trên ứng dụng.</p>
            <p>Trân trọng,<br/>Đội ngũ hỗ trợ Vibely</p>
            `
        );

        // Send email response using Resend
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_USER || 'Vibely <onboarding@resend.dev>',
            to: inquiry.userId.email,
            subject: `Phản hồi yêu cầu hỗ trợ: ${inquiry.subject}`,
            html: htmlContent
        });

        if (error) {
            console.error("Resend error:", error);
            throw new Error(error.message);
        }
    }

    await inquiry.save();

    res.status(200).json({
        success: true,
        data: inquiry
    });
});

// Xóa yêu cầu hỗ trợ
const deleteInquiry = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
        res.status(404);
        throw new Error("Inquiry not found");
    }

    await inquiry.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

module.exports = {
    getInquiries,
    updateInquiry,
    deleteInquiry
}; 