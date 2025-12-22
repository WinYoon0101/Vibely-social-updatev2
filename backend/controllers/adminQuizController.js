const Quiz = require('../model/Quiz.js');
const response = require("../utils/responseHandler");

// Tạo quiz mới
const createQuiz = async (req, res) => {
    try {
        const { quizTitle, icon, quizQuestions } = req.body;

        if (!quizTitle || !icon || !quizQuestions) {
            return response(res, 400, "Vui lòng cung cấp đầy đủ thông tin.");
        }

        const newQuiz = await Quiz.create({ quizTitle, icon, quizQuestions });

        return response(res, 201, "Quiz đã được tạo thành công!", newQuiz);
    } catch (error) {
        return response(res, 500, "Lỗi server", error.message);
    }
};

// Lấy danh sách quiz
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        return response(res, 200, "Lấy danh sách quiz thành công!", quizzes);
    } catch (error) {
        return response(res, 500, "Lỗi server", error.message);
    }
};

// Cập nhật quiz
const updateQuiz = async (req, res) => {
    try {
        const id = req.params.id;
        const { quizTitle, icon, quizQuestions } = req.body;

        if (!quizTitle || !icon || !quizQuestions) {
            return response(res, 400, "Vui lòng cung cấp đầy đủ thông tin.");
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            { quizTitle, icon, quizQuestions },
            { new: true }
        );

        if (!updatedQuiz) {
            return response(res, 404, "Quiz không tồn tại.");
        }

        return response(res, 200, "Cập nhật quiz thành công!", updatedQuiz);
    } catch (error) {
        return response(res, 500, "Lỗi server", error.message);
    }
};

// Xóa quiz
const deleteQuiz = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        if (!deletedQuiz) return response(res, 404, "Quiz không tồn tại.");

        return response(res, 200, "Xóa quiz thành công!", deletedQuiz);
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

module.exports = {
    createQuiz,
    getQuizzes,
    updateQuiz,
    deleteQuiz,
    getQuizById
}; 