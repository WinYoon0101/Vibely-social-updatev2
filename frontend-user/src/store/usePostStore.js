import { addCommentToPost, createPost, getAllPosts, getAllStories, getPostByUserId, reactPost, sharePost, createStory, reactStory, getAllUserPosts, addReplyToPost, deletePost, deleteComment, deleteReply, likeComment, editPost, deleteStory } from '@/service/post.service';
import toast from 'react-hot-toast';
import { create } from 'zustand';
//quản lý trạng thái các bài viết và story
export const usePostStore = create((set)=>({
    posts:[],   //lưu danh sách tất cả bài viết.
    stories:[], //lưu danh sách tất cả story

    userPosts:[],   //lưu danh sách bài viết của người dùng

    loading : false,  //trạng thái tải
    error : null, //lưu lỗi

    fetchPosts: async()=> {
        set({loading:true})
        try {
            const posts = await getAllPosts();
            set({posts,loading:false})
        } catch (error) {
            set({error, loading:false})
        }
    },
    
    //fetch user posts
  fetchUserPost: async (userId) => {
    set({ loading: true });
    try {
      const userPosts = await getAllUserPosts(userId);
      set({ userPosts, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
    
    fetchStories: async()=> {
        set({loading:true})
        try {
        const res = await getAllStories();
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Lùi lại 24 giờ
        //Story chỉ tồn tại trong 24h 
        const filterStories = res.filter(story => {
            const storyDate = new Date(story.createdAt);
            return storyDate >= last24Hours; // Chỉ lấy story có thời gian >= thời gian 24h trước
        });
        set({stories:filterStories,loading:false})
        } catch (error) {
            set({error, loading:false})
        }
    },

    handleCreatePost: async(postData) =>{
        set({loading:true})
        try {
            const newPost = await createPost(postData)
            set((state)=>({
                posts : [newPost,...state.posts],   //thêm bài đăng mới vào danh sách các bài đăng
                loading: false,    
            }))
            toast.success("Tạo bài đăng thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại.")
        }
    },

    handleEditPost: async(postId, postData) =>{
        set({loading:true})
        try {
            const editedPost = await editPost(postId, postData)
            set((state)=>({
                posts: state.posts.map((post)=>
                post?._id === postId
                ?editedPost
                :post
                ),
                loading:false
            }))
            toast.success("Sửa bài viết thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi đăng bài. Vui lòng thử lại.")
        }
    },

    handleCreateStory: async(storyData) =>{
        set({loading:true})
        try {
            const newStory = await createStory(storyData)  //thêm story mới vào danh sách các story
            set((state)=>({
                stories : [newStory,...state.stories],
                loading: false,    
            }))
            toast.success("Tạo story thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi đăng story. Vui lòng thử lại.")
        }
    },

    handleDeleteStory:async(storyId) =>{
        set({loading:true})
        try {
            await deleteStory(storyId)
            toast.success("Xóa story thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi xóa story. Vui lòng thử lại.")
        }
    },

    handleReactPost : async (postId, reactType) => {
        set({ loading: true });
        try {
            const updatedStats = await reactPost(postId, reactType);
            set((state) => ({
                posts: state.posts.map(post =>
                    post._id === postId ? { ...post, reactionStats: updatedStats.reactionStats } : post
                ),
                loading: false
            }));
        } catch (error) {
            set({ error, loading: false });
            toast.error("Lỗi khi react bài viết. Vui lòng thử lại.");
        }
    },
    handleReactStory : async(storyId) =>{
        set({ loading: true });
        try {
            const updatedStats = await reactStory(storyId);
            set((state) => ({
                stories: state.stories.map(story =>
                    story._id === storyId ? { ...story, reactionStats: updatedStats.reactionStats } : story
                ),
                loading: false
            }));
        } catch (error) {
            set({ error, loading: false });
            toast.error("Lỗi khi react bài viết. Vui lòng thử lại.");
        }
    },

    handleCommentPost: async(postId,commentText) =>{
        set({loading:true})
        try {
            const newComment = await addCommentToPost(postId,commentText)
            set((state)=>({
                posts: state.posts.map((post)=>
                post?._id === postId
                ?newComment?.data   //object trả về là nguyên cái bài viết chứ ko phải mỗi cmt :))
                //thêm 1 comment vào phẩn cuối danh sách comments của 1 bài viết với _id là postId
                :post
                ),
                loading:false
            }))
            toast.success("Thêm bình luận thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi thêm bình luận. Vui lòng thử lại.")
        }
    },

    handleReplyComment: async(postId,commentId, replyText) =>{
        set({loading:true})
        try {
            const newReply = await addReplyToPost(postId,commentId,replyText)
            set((state)=>({
                posts: state.posts.map((post)=>
                post?._id === postId
                ?newReply?.data
                :post
                ),
                loading:false
            }))
            toast.success("Thêm phản hồi thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi thêm phản hồi. Vui lòng thử lại.")
        }
    },

    handleSharePost: async(postId) =>{
        set({loading:true})
        try {
            await sharePost(postId) 
            toast.success("Chia sẻ bài viết thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi chia sẻ bài viết. Vui lòng thử lại.")
        }
    },

    handleDeletePost:async(postId) =>{
        set({loading:true})
        try {
            await deletePost(postId) 
            toast.success("Xóa bài viết thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi xóa bài viết. Vui lòng thử lại.")
        }
    },

    handleDeleteComment:async(postId, commentId)=>{
        set({loading:true})
        try {
            await deleteComment(postId, commentId) 
            toast.success("Xóa bình luận thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi xóa bình luận. Vui lòng thử lại.")
        }
    },

    handleDeleteReply:async(postId, commentId, replyId)=>{
        set({loading:true})
        try {
            await deleteReply(postId, commentId, replyId) 
            toast.success("Xóa phản hồi thành công.")
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi xóa phản hồi. Vui lòng thử lại.")
        }
    },

    handleLikeComment:async(postId, commentId)=>{
        set({loading:true})
        try {
            const newReply = await likeComment(postId,commentId)
            set((state)=>({
                posts: state.posts.map((post)=>
                post?._id === postId
                ?newReply?.data
                :post
                ),
                loading:false
            }))
        } catch (error) {
            set({error, loading:false})
            toast.error("Đã xảy ra lỗi khi thích bình luận. Vui lòng thử lại.")
        }
    },
}))