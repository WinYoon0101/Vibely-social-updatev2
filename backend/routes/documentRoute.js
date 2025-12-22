const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const {
    getFilteredDocuments,
    getDocumentById,
    getLevels,
    getSubjectsByLevel,
    saveDocument
} = require("../controllers/documentController");

// Route lấy danh sách cấp học
router.get("/levels", authMiddleware, getLevels);

// Route lấy danh sách môn học theo cấp học
router.get("/subjects/:levelId", authMiddleware, getSubjectsByLevel);

// Route lưu tài liệu
router.post("/save", authMiddleware, saveDocument);

// Route lấy danh sách tài liệu theo điều kiện lọc
router.get("/", authMiddleware, getFilteredDocuments);

// Route lấy tài liệu theo ID
router.get("/:id", authMiddleware, getDocumentById);

module.exports = router;