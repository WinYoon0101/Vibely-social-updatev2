import axiosInstance from "./url.service";

export const getMyNotifications = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get(`/notif/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        throw error;
    }
}

export const setAllAsRead = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.put(`/notif/readAll`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
        throw error;
    }
}

export const setAsRead = async (notifId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post(`/notif/read/${notifId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
        throw error;
    }
}

export const setAsUnread = async (notifId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.put(`/notif/read/${notifId}`, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data;
    } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
        throw error;
    }
}