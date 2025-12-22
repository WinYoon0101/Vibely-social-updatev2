const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
    createQuiz,
    getQuizzes,
    updateQuiz,
    deleteQuiz,
    getQuizById
} = require("../controllers/adminQuizController");

const router = express.Router();

// Route tạo quiz
router.post("/", adminAuthMiddleware, createQuiz);

// Route lấy tất cả các quiz
router.get("/", adminAuthMiddleware, getQuizzes);

// Route cập nhật quiz
router.put("/:id", adminAuthMiddleware, updateQuiz);

// Route xóa quiz
router.delete("/:id", adminAuthMiddleware, deleteQuiz);

// Route lấy quiz theo ID
router.get("/:id", adminAuthMiddleware, getQuizById);

module.exports = router; 