const User = require("../model/User");
const Post = require("../model/Post");
const Document = require("../model/Document");
const Inquiry = require("../model/Inquiry");

// Hàm nhóm dữ liệu theo ngày, tháng, năm
const groupByTime = async (Model, timeUnit) => {
    let groupId;

    if (timeUnit === "day") {
        groupId = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
        };
    } else if (timeUnit === "month") {
        groupId = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
        };
    } else {
        groupId = { year: { $year: "$createdAt" } };
    }

    return await Model.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), 0, 1), // Lấy từ đầu năm
                },
            },
        },
        {
            $group: {
                _id: groupId,
                count: { $sum: 1 },
            },
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
        },
    ]);
};

// Lấy dữ liệu tổng quan
const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Post.countDocuments();
        const totalDocuments = await Document.countDocuments();
        const totalInquiries = await Inquiry.countDocuments();

        const { timeUnit = "month" } = req.query;

        const usersData = await groupByTime(User, timeUnit);
        const postsData = await groupByTime(Post, timeUnit);
        const documentsData = await groupByTime(Document, timeUnit);
        const inquiriesData = await groupByTime(Inquiry, timeUnit);

        return res.status(200).json({
            totalUsers,
            totalPosts,
            totalDocuments,
            totalInquiries,
            usersData,
            postsData,
            documentsData,
            inquiriesData,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin tổng quan:", error);
        return res.status(500).json({ error: error.message });
    }
};
// Lấy dữ liệu thống kê theo thời gian
const getDashboardStats = async (req, res) => {
    try {
        const { timeUnit = "month" } = req.query;

        const usersStats = await groupByTime(User, timeUnit);
        const postsStats = await groupByTime(Post, timeUnit);
        const documentsStats = await groupByTime(Document, timeUnit);
        const inquiriesStats = await groupByTime(Inquiry, timeUnit);

        return res.status(200).json({
            usersStats,
            postsStats,
            documentsStats,
            inquiriesStats
        });
    } catch (error) {
        console.error("Lỗi khi lấy thống kê dữ liệu:", error);
        return res.status(500).json({ error: error.message });
    }
};
// Lấy số lượng người dùng
const getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        return res.status(200).json({ totalUsers });
    } catch (error) {
        console.error("Lỗi khi lấy tổng số người dùng:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Lấy số lượng bài viết
const getTotalPosts = async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments();
        return res.status(200).json({ totalPosts });
    } catch (error) {
        console.error("Lỗi khi lấy tổng số bài viết:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Lấy số lượng tài liệu
const getTotalDocuments = async (req, res) => {
    try {
        const totalDocuments = await Document.countDocuments();
        return res.status(200).json({ totalDocuments });
    } catch (error) {
        console.error("Lỗi khi lấy tổng số tài liệu:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Lấy số lượng câu hỏi
const getTotalInquiries = async (req, res) => {
    try {
        const totalInquiries = await Inquiry.countDocuments();
        return res.status(200).json({ totalInquiries });
    } catch (error) {
        console.error("Lỗi khi lấy tổng số câu hỏi:", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAdminDashboard,
    getTotalUsers,
    getTotalPosts,
    getTotalDocuments,
    getTotalInquiries,
    getDashboardStats,
};
