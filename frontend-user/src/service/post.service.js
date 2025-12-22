import axiosInstance from "./url.service"
//Các phương thức dùng để tương tác với API

//Phương thức tạo bài viết
export const createPost = async (postData) => {
    try {
        const result = await axiosInstance.post('/users/posts', postData)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

//Phương thức tạo story
export const createStory = async (storyData) => {
    try {
        const result = await axiosInstance.post('/users/story', storyData)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

//Phương thức lấy tất cả bài viết
export const getAllPosts = async () => {
    try {
        const result = await axiosInstance.get('/users/posts')
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

//Phương thức lấy tất cả bài viết của người dùng
export const getAllUserPosts = async (userId) => {
    try {
        const result = await axiosInstance.get(`/users/posts/user/${userId}`)
        return result?.data?.data;
    } catch (error) {
        //console.error(error)
        throw error;
    }
}

//phương thức lấy tất cả story
export const getAllStories = async () => {
    try {
        const result = await axiosInstance.get('/users/story')
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

// phương thức để react cho một bài viết
export const reactPost = async (postId, reactType) => {
    try {
        const result = await axiosInstance.post(`users/posts/reacts/${postId}`, { type: reactType });
        return result?.data;
    } catch (error) {
        //console.error("Lỗi khi react bài viết:", error);
        throw error;
    }
};

// phương thức để comment cho một bài viết
export const addCommentToPost = async (postId, commentText) => {
    try {
        const result = await axiosInstance.post(`/users/posts/comments/${postId}`, commentText)
        return result?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const addReplyToPost = async (postId, commentId, replyText) => {
    try {
        const result = await axiosInstance.post(`/users/posts/reply/${postId}`, { commentId, replyText })
        return result?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

// phương thức để share cho một bài viết
export const sharePost = async (postId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/share/${postId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

//Phương thức lấy 1 bài viết theo ID
export const getSinglePost = async (postId) => {
    try {
        const result = await axiosInstance.get(`/users/posts/${postId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}
//tim story
export const reactStory = async (postId) => {
    try {
        const result = await axiosInstance.post(`users/story/reacts/${postId}`);
        return result?.data;
    } catch (error) {
        //console.error("Lỗi khi react bài viết:", error);
        throw error;
    }
};

//xóa bài viết
export const deletePost = async (postId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/deletePost/${postId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const deleteComment = async (postId, commentId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/deleteComment/${postId}/${commentId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const deleteReply = async (postId, commentId, replyId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/deleteReply/${postId}/${commentId}/${replyId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const likeComment = async (postId, commentId) => {
    try {
        const result = await axiosInstance.post(`/users/posts/reactComment/${postId}`, { commentId })
        return result?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}
//Phương thức sửa bài viết
export const editPost = async (postId, postData) => {
    try {
        const result = await axiosInstance.put(`/users/posts/edit/${postId}`, postData)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}

export const deleteStory = async (storyId) => {
    try {
        const result = await axiosInstance.delete(`/users/posts/deleteStory/${storyId}`)
        return result?.data?.data
    } catch (error) {
        //console.error(error)
        throw error
    }
}