import axiosInstance from "./url.service";

// Tạo nhóm mới
export const createGroup = async (formData) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post("/groups/create", formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi tạo nhóm:", error);
        throw error;
    }
};

// Lấy danh sách tất cả nhóm của người dùng
export const getMyGroups = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get("/groups/", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
        throw error;
    }
};

// Lấy danh sách tất cả nhóm còn lại
export const getOtherGroups = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get("/groups/other", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
        throw error;
    }
};

// Lấy danh sách tất cả các nhóm
export const getAllGroups = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get("/groups/all", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
        throw error;
    }
};

// Tham gia nhóm
export const joinGroup = async (groupId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post(`/groups/join/${groupId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi tham gia nhóm:", error);
        throw error;
    }
};

export const leaveGroup = async (groupId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.put(`/groups/join/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi rời nhóm:", error);
        throw error;
    }
}

// Lấy thông tin nhóm theo ID
export const getGroupById = async (groupId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get(`/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin nhóm:", error);
        throw error;
    }
};

// Chỉnh sửa nhóm
export const editGroup = async (groupId, formData) => {
    try {
        console.log(formData)
        const token = localStorage.getItem("token");
        const result = await axiosInstance.put(`/groups/${groupId}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi chỉnh sửa nhóm:", error);
        throw error;
    }
}

export const createGroupPost = async (groupId, formData) => {
    try {
        console.log(formData)
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post(`/groups/${groupId}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi chỉnh sửa nhóm:", error);
        throw error;
    }
}

export const addAdmin = async (groupId, userId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post(`/groups/${groupId}/admins/${userId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi thêm quản trị viên:", error);
        throw error;
    }
}

export const removeAdmin = async (groupId, userId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.put(`/groups/${groupId}/admins/${userId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi xóa quản trị viên:", error);
        throw error;
    }
}

export const kickMember = async (groupId, userId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post(`/groups/${groupId}/kick/${userId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi xóa thành viên khỏi nhóm:", error);
        throw error;
    }
 }