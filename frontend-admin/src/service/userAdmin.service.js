import axiosInstance from "./urlAdmin.service";

// Lấy danh sách tất cả users
export const getAllUsers = async () => {
    try {
        const result = await axiosInstance.get("/admin/users");
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách users:", error);
        throw error;
    }
};

// Xóa user theo ID
export const deleteUser = async (userId) => {
    try {
        const result = await axiosInstance.delete(`/admin/users/${userId}`);
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi xóa user:", error);
        throw error;
    }
};

// Tìm kiếm users
export const searchUsers = async (query) => {
    try {
        const result = await axiosInstance.get(`/admin/users/search?q=${query}`);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm users:", error);
        throw error;
    }
}; 

// Lấy danh sách bạn bè của user
export const getAllFriends = async (userId) => {
    try {
        const result = await axiosInstance.get(`/admin/users/friends/${userId}`);
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
        throw error;
    }
};