const Quiz = require('../model/Quiz.js');
const response = require("../utils/responseHandler");

// Lấy danh sách quiz
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        return response(res, 200, "Lấy danh sách quiz thành công!", quizzes);
    } catch (error) {
        return response(res, 500, "Lỗi server", error.message);
    }
};

// Lấy thông tin quiz theo ID
const getQuizById = async (req, res) => {
    try {
        const id = req.params.id;
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return response(res, 404, "Quiz không tồn tại.");
        }

        return response(res, 200, "Lấy quiz thành công!", quiz);
    } catch (error) {
        return response(res, 500, "Lỗi server", error.message);
    }
};

// Cập nhật quiz
const updateQuiz = async (req, res) => {
    try {
        const id = req.params.id;
        const { updateQuizQuestions } = req.body;

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return response(res, 404, "Quiz không tồn tại.");
        }

        // Cập nhật các câu hỏi
        if (updateQuizQuestions) {
            quiz.quizQuestions = updateQuizQuestions;
        }

        const updatedQuiz = await quiz.save();
        return response(res, 200, "Cập nhật quiz thành công!", updatedQuiz);
    } catch (error) {
        return response(res, 500, "Lỗi server", error.message);
    }
};

module.exports = {
    getQuizzes,
    getQuizById,
    updateQuiz
};