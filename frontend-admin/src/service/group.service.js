import axiosInstance from "./urlAdmin.service";

export const getAllGroups = async () => {
    try {
        const token = localStorage.getItem("adminToken")
        const result = await axiosInstance.get('/groups/all', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
        throw error;
    }
};

export const deleteGroup = async (groupId) => {
    try {
        const token = localStorage.getItem("adminToken")
        const result = await axiosInstance.delete(`/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
        throw error;
    }
};