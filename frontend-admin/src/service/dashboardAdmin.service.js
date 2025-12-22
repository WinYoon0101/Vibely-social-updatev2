import axiosInstance from "./urlAdmin.service";

// Hàm hỗ trợ lấy token
const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
};

// Lấy tổng số lượng người dùng
export const getTotalUsers = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-users", getAuthHeaders());
        return result?.data?.totalUsers;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Lấy tổng số lượng bài viết
export const getTotalPosts = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-posts", getAuthHeaders());
        return result?.data?.totalPosts;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Lấy tổng số lượng tài liệu
export const getTotalDocuments = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-documents", getAuthHeaders());
        return result?.data?.totalDocuments;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Lấy tổng số lượng câu hỏi
export const getTotalQuestions = async () => {
    try {
        const result = await axiosInstance.get("/admin/dashboard/total-inquiries", getAuthHeaders());
        return result?.data?.totalInquiries;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Lấy dữ liệu thống kê theo năm, tháng hoặc ngày
export const getDashboardStats = async (timeUnit = "month") => {
    try {
        const result = await axiosInstance.get(`/admin/dashboard/stats?timeUnit=${timeUnit}`, getAuthHeaders());
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", error);
        throw error;
    }
};
