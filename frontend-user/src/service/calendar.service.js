import axiosInstance from "./url.service";

// Thêm sự kiện vào lịch
export const createEvent = async (event) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.post("/schedules", event, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi tạo nhóm:", error);
        throw error;
    }
};

export const getEvents = async () => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.get("/schedules", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy sự kiện:", error);
        throw error;
    }
}

export const editEvent = async (scheduleId,body) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.put(`/schedules/${scheduleId}`,body, {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json' 
            }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi sửa sự kiện:", error);
        throw error;
    }
}

export const deleteEvent = async (scheduleId) => {
    try {
        const token = localStorage.getItem("token");
        const result = await axiosInstance.delete(`/schedules/${scheduleId}`,{
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi sửa sự kiện:", error);
        throw error;
    }
}

export const getNextEvent = async()=>{
    try {
        const token = localStorage.getItem("token")
        const result = await axiosInstance.get(`/schedules/next`,{
            headers: { Authorization: `Bearer ${token}` }
        });
        return result?.data?.data;
    } catch (error) {
        console.error("Lỗi khi lấy sự kiện tiếp theo:", error);
        throw error;
    }
}