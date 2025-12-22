import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/schedules' || 'http://localhost:8081/schedules';

// Lấy tất cả lịch trình
export const getSchedules = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

// Thêm lịch trình mới
export const createSchedule = async (schedule) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, schedule, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Cập nhật lịch trình
export const updateSchedule = async (scheduleId, updatedSchedule) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${scheduleId}`, updatedSchedule, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Xóa lịch trình
export const deleteSchedule = async (scheduleId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${scheduleId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
