import axiosInstance from "./urlAdmin.service";

// Đăng nhập Admin
export const loginAdmin = async (adminData) => {
    try {
        const response = await axiosInstance.post('/admin/auth/login', adminData);
        if (response.data.data.token) {
            localStorage.setItem("adminToken", response.data.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Đăng xuất Admin
export const logoutAdmin = async () => {
    try {
        const response = await axiosInstance.post('/admin/auth/logout');
        localStorage.removeItem("adminToken");
        return response.data;
    } catch (error) {
        console.error("Lỗi đăng xuất:", error.response?.data?.message || error.message);
        throw error;
    }
};

// Kiểm tra xem Admin đã đăng nhập chưa
export const checkAdminAuth = async () => {
    try {
        const response = await axiosInstance.get('/admin/auth/check-auth');
        return { isAuthenticated: true, admin: response.data.data };
    } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error.response?.data?.message || error.message);
        return { isAuthenticated: false };
    }
};

// Cập nhật mật khẩu Admin
export const updateAdminPassword = async (passwordData) => {
    try {
        const response = await axiosInstance.put('/admin/auth/update-password', passwordData);
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error.response?.data?.message || error.message);
        throw error;
    }
};