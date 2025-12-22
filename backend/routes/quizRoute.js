const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getQuizzes,
    getQuizById,
    updateQuiz
} = require("../controllers/quizController");

const router = express.Router();

// Route lấy tất cả các quiz
router.get("/", authMiddleware, getQuizzes);

// Route lấy quiz theo ID
router.get("/:id", authMiddleware, getQuizById);

// Route cập nhật quiz
router.put("/:id", authMiddleware, updateQuiz);

module.exports = router;
