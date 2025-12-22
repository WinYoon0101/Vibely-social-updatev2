import axiosInstance from './urlAdmin.service';

// Lấy danh sách câu hỏi quiz
export const getQuizzes = async () => {
    try {
        const response = await axiosInstance.get('/admin/quiz');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Lấy danh sách câu hỏi quiz theo ID
export const getQuizById = async (quizId) => {
    try {
        const response = await axiosInstance.get(`/admin/quiz/${quizId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Tạo câu hỏi quiz mới
export const createQuiz = async (quizData) => {
    try {
        const response = await axiosInstance.post('/admin/quiz', quizData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Cập nhật câu hỏi quiz
export const updateQuiz = async (quizId, quizData) => {
    try {
        const response = await axiosInstance.put(`/admin/quiz/${quizId}`, quizData);
        return response.data;
    } catch (error) {
        console.error('Lỗi:', error.response || error);
        throw error;
    }
};

// Xóa câu hỏi quiz
export const deleteQuiz = async (quizId) => {
    try {
        const response = await axiosInstance.delete(`/admin/quiz/${quizId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 