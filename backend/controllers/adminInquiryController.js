const Inquiry = require("../model/Inquiry");
const User = require("../model/User");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

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

        // Send email response
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: inquiry.userId.email,
            subject: `Response to your inquiry: ${inquiry.subject}`,
            text: response
        };

        await transporter.sendMail(mailOptions);
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