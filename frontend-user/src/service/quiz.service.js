import axiosInstance from "./url.service";

// Tạo quiz mới
export const createQuiz = async (quizData) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post("/quizzes", quizData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi tạo quiz:", error);
        throw error;
    }
};

// Lấy danh sách tất cả quiz
export const getAllQuizzes = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get("/quizzes", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        throw error;
    }
};

// Lấy quiz theo ID
export const getQuizById = async (quizId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get(`/quizzes/${quizId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy quiz theo ID:", error);
        throw error;
    }
};

// Cập nhật quiz
export const updateQuiz = async (quizId, quizData) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.put(`/quizzes/${quizId}`, quizData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật quiz:", error);
        throw error;
    }
};

// Xóa quiz
export const deleteQuiz = async (quizId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.delete(`/quizzes/${quizId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi xóa quiz:", error);
        throw error;
    }
};
