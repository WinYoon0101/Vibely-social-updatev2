const Document = require("../model/Document");
const Level = require("../model/Level");
const Subject = require("../model/Subject");
const response = require("../utils/responseHandler");
const User = require("../model/User");

// Lấy danh sách cấp học
const getLevels = async (req, res) => {
    try {
        const levels = await Level.find().select("name");
        return response(res, 200, "Lấy danh sách cấp học thành công", levels);
    } catch (error) {
        return response(res, 500, "Lấy danh sách cấp học thất bại", error.message);
    }
};

// Lấy danh sách môn học theo cấp học
const getSubjectsByLevel = async (req, res) => {
    try {
        const { levelId } = req.params;
        const subjects = await Subject.find({ level: levelId }).select("name");

        return response(res, 200, "Lấy danh sách môn học thành công", subjects);
    } catch (error) {
        return response(res, 500, "Lấy danh sách môn học thất bại", error.message);
    }
};

// Lấy danh sách tài liệu theo điều kiện lọc
const getFilteredDocuments = async (req, res) => {
    try {
        const { query, level, subject } = req.query;
        let filter = {};

        if (level && level !== "Tất cả các cấp") filter.level = level;
        if (subject && subject !== "Tất cả các môn") filter.subject = subject;
        if (query) filter.title = { $regex: query, $options: "i" };

        const documents = await Document.find(filter)
            .populate("level", "name")
            .populate("subject", "name")
            .sort({ createdAt: -1 });

        return response(res, 200, "Lấy danh sách tài liệu thành công", documents);
    } catch (error) {
        return response(res, 500, "Lấy danh sách tài liệu thất bại", error.message);
    }
};

// Lấy tài liệu theo ID
const getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id)
            .populate("level", "name")
            .populate("subject", "name");

        if (!document) return response(res, 404, "Không tìm thấy tài liệu");

        return response(res, 200, "Lấy tài liệu theo ID thành công", document);
    } catch (error) {
        return response(res, 500, "Lấy tài liệu thất bại", error.message);
    }
};

// Lưu tài liệu
const saveDocument = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({ message: "Thiếu documentId" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        if (user.savedDocuments.includes(documentId)) {
            return res.status(400).json({ message: "Tài liệu đã được lưu trước đó" });
        }

        user.savedDocuments.push(documentId);
        await user.save();

        res.status(200).json({ message: "Lưu tài liệu thành công", savedDocuments: user.savedDocuments });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lưu tài liệu" });
    }
};

module.exports = {
    getFilteredDocuments,
    getDocumentById,
    getLevels,
    getSubjectsByLevel,
    saveDocument
};