import axiosInstance from './urlAdmin.service';

// Lấy danh sách thắc mắc
export const getInquiries = async (query = '', status = '') => {
    try {
        let url = `/admin/inquiry?`;
        if (query) url += `query=${query}&`;
        if (status) url += `status=${status}`;

        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Cập nhật thắc mắc
export const updateInquiry = async (inquiryId, data) => {
    try {
        const response = await axiosInstance.put(
            `/admin/inquiry/${inquiryId}`,
            data
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Xóa thắc mắc
export const deleteInquiry = async (inquiryId) => {
    try {
        const response = await axiosInstance.delete(
            `/admin/inquiry/${inquiryId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}; 