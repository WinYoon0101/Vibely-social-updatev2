import axiosInstance from "./url.service";

// Lấy danh sách yêu cầu kết bạn
export const getAllFriendsRequest = async() =>{
    try {
        const response = await axiosInstance.get('/users/friend-request')
        return response?.data;
    } catch (error) {
        throw error;   
    }
}

//  Lấy danh sách gợi ý kết bạn
export const getAllFriendsSuggestion = async() =>{
    try {
        const response = await axiosInstance.get('/users/user-to-request')
        return response?.data;
    } catch (error) {
        throw error;   
    }
}

// Gửi lời mời kết bạn
export const followUser = async(userId) =>{
    try {
        const response = await axiosInstance.post('/users/follow', {userIdToFollow:userId})
        return response?.data;
    } catch (error) {
        throw error;   
    }
}

// Hủy kết bạn
export const UnfollowUser = async(userId) =>{
    try {
        const response = await axiosInstance.post('/users/unfollow', {userIdToUnfollow:userId})
        return response?.data;
    } catch (error) {
        throw error;   
    }
}

// Xóa một yêu cầu kết bạn
export const deleteUserFromRequest = async(userId) =>{
    try {
        const response = await axiosInstance.post('/users/friend-request/remove', {requestSenderId:userId})
        return response?.data;
    } catch (error) {
        throw error;   
    }
}

//  Lấy thông tin hồ sơ người dùng
export const fetchUserProfile = async(userId) =>{
    try {
        const response = await axiosInstance.get(`/users/profile/${userId}`)
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Lấy danh sách bạn chung
export const getMutualFriends = async(userId) =>{
    try {
        const response = await axiosInstance.get(`/users/mutual-friends/${userId}`)
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Cập nhật hồ sơ người dùng
export const updateUserProfile = async(userId,updateData) =>{
    try {
        const response = await axiosInstance.put(`/users/profile/${userId}`,updateData)
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Cập nhật ảnh bìa hồ sơ
export const updateUserCoverPhoto = async(userId,updateData) =>{
    try {
        const response = await axiosInstance.put(`/users/profile/cover-picture/${userId}`,updateData)
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Tạo hoặc cập nhật tiểu sử (Bio) của người dùng
export const createOrUpdateUserBio = async(userId,bioData) =>{
    try {
        const response = await axiosInstance.put(`/users/bio/${userId}`,bioData)
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Lấy tất cả người dùng
export const getAllUsers = async() =>{
    try {
        const response = await axiosInstance.get('/users')
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Lấy danh sách tài liệu đã lưu của người dùng
export const getSavedDocuments = async() =>{
    try {
        const response = await axiosInstance.get('/users/saved')
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Lấy tài liệu đã lưu theo id
export const getSavedDocumentById = async(documentId) =>{
    try {
        const response = await axiosInstance.get(`/users/saved/${documentId}`)
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}

// Bỏ lưu tài liệu
export const unsaveDocument = async(documentId) =>{
    try {
        const response = await axiosInstance.delete(`/users/saved/${documentId}`)
        return response?.data?.data;
    } catch (error) {
        throw error;   
    }
}