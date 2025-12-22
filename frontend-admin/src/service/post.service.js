import axiosInstance from "./urlAdmin.service";


//Phương thức lấy tất cả bài viết
export const getAllPosts = async() => {
    try {
        const token = localStorage.getItem("adminToken")
        const result = await axiosInstance.get('/admin/posts/posts', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Phương thức lấy tất cả bài viết của người dùng
export const getAllUserPosts = async(userId)=>{
    try {
        const result = await axiosInstance.get(`/admin/posts/user/${userId}`)
        return result?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}


//Phương thức lấy 1 bài viết theo ID
export const getSinglePost = async(postId) => {
    try {
        const result = await axiosInstance.get(`/admin/posts/${postId}`)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}


//xóa bài viết
export const deletePost = async(postId) => {
    try {
        const result = await axiosInstance.delete(`/admin/posts/deletePost/${postId}`)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteComment = async(postId, commentId) => {
    try {
        const result = await axiosInstance.delete(`/admin/posts/deleteComment/${postId}/${commentId}`)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteReply = async(postId, commentId, replyId) => {
    try {
        const result = await axiosInstance.delete(`/admin/posts/deleteReply/${postId}/${commentId}/${replyId}`)
        return result?.data?.data
    } catch (error) {
        console.error(error)
        throw error
    }
}