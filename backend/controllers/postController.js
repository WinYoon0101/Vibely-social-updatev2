const { uploadFileToCloudinary } = require("../config/cloudinary");
const Post = require("../model/Post");
const Story = require("../model/Story");
const response = require("../utils/responseHandler");

//Tạo bài viết
const createPost = async (req, res) => {
    try {
        const userId = req.user.userId;        
        const { content } = req.body;
        const file = req.file;
        let mediaUrl = null;
        let mediaType = null;

        // Kiểm tra nếu có file thì upload lên Cloudinary
        if (file) {
            const uploadResult = await uploadFileToCloudinary(file);
            if (!uploadResult || !uploadResult.secure_url) {
                return response(res, 400, "Lỗi khi tải lên tệp.");
            }

            mediaUrl = uploadResult.secure_url;
            mediaType = file.mimetype.startsWith("video") ? "video" : "image";
        }

        // Tạo bài viết mới với các thông số ban đầu
        const newPost = new Post({
            user: userId,
            content,
            mediaUrl,
            mediaType,
            reactionCount: 0,
            commentCount: 0,
            shareCount: 0,
            reactionStats: {
                like: 0,
                love: 0,
                haha: 0,
                wow: 0,
                sad: 0,
                angry: 0
            }
        });

        await newPost.save();
        return response(res, 201, "Tạo bài viết thành công", newPost);

    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
        return response(res, 500, "Tạo bài viết thất bại", error.message);
    }
};

//Tạo story
const createStory = async (req, res) => {
    try {
        const userId = req.user.userId;        
        const file = req.file;
        if (!file) {
            return response(res, 400, "Cần tải file lên để tạo story");
        }

        const isVideo = file.mimetype.startsWith("video");
        const isImage = file.mimetype.startsWith("image");

        if (!isVideo && !isImage) {
            return response(res, 400, "Chỉ hỗ trợ ảnh hoặc video");
        }

        const uploadResult = await uploadFileToCloudinary(file);
        if (!uploadResult?.secure_url) {
            return response(res, 500, "Lỗi khi tải file lên");
        }

        const newStory = new Story({
            user: userId,
            mediaUrl: uploadResult.secure_url,
            mediaType: isVideo ? "video" : "image",
        });

        await newStory.save();
        return response(res, 201, "Tạo story thành công", newStory);

    } catch (error) {
        console.error("Lỗi khi tạo story:", error);
        return response(res, 500, "Tạo story thất bại", error.message);
    }
};

const editPost = async(req,res) =>{
    const {postId} = req.params;
    const {content, flag} = req.body
    const file = req.file;
    let mediaUrl = null;
    let mediaType = null;
    try{
        // Kiểm tra nếu có file thì upload lên Cloudinary
        if (file) {
            const uploadResult = await uploadFileToCloudinary(file);
            if (!uploadResult || !uploadResult.secure_url) {
                return response(res, 400, "Lỗi khi tải lên tệp.");
            }

            mediaUrl = uploadResult.secure_url;
            mediaType = file.mimetype.startsWith("video") ? "video" : "image";
        }
        if(flag==0){
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { content },
                {new: true}
            );
            return response(res, 201, "Sửa bài viết thành công", updatedPost);
        }else{  //flag=1 hay -1 đều cập nhật media
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { content ,
                mediaUrl ,
                mediaType },
                {new: true}
            );
            return response(res, 201, "Sửa bài viết thành công", updatedPost);
        }
    }catch(error){
        console.error("Lỗi khi sửa bài viết:", error);
        return response(res, 500, "Sửa bài viết thất bại", error.message);
    }
}
//Lấy tất cả bài viết
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("user", "_id username profilePicture email")
        .populate({
            path: 'comments.user',
            select: 'username profilePicture'
        })
        .populate({
            path: 'comments.replies.user',
            select: 'username profilePicture'
        })
        .populate({
            path: 'reactions.user',
            select: 'username profilePicture'
        })
        return response(res, 200, "Lấy tất cả bài viết thành công", posts);
    } catch (error) {
        console.error("Lỗi khi lấy tất cả bài viết:", error);
        return response(res, 500, "Lấy tất cả bài viết thất bại", error.message);
    }
};

//Lấy tất cả story
const getAllStories = async (req, res) => {
    try {
        const stories = await Story.find()
        .sort({ createdAt: -1 })
        .populate("user", "_id username profilePicture email")
        .populate({
            path: 'reactions.user',
            select: 'username profilePicture'
        })
        return response(res, 200, "Lấy tất cả story thành công", stories);
    } catch (error) {
        console.error("Lỗi khi lấy tất cả story:", error);
        return response(res, 500, "Lấy tất cả story thất bại", error.message);
    }
};

//Lấy bài viết theo ID người dùng
const getPostByUserId = async (req, res) => {
    const userId = req.params.id;
    try{
        if (!userId) {
            return response(res, 400, "Yêu cầu mã người dùng để lấy bài viết");
        }
        const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user", "_id username profilePicture email")
        .populate({
            path: 'comments.user',
            select: 'username profilePicture'
        })
        .populate({
            path: 'comments.replies.user',
            select: 'username profilePicture'
        })
        return response(res, 200, "Lấy bài viết theo ID người dùng thành công", posts);
    }
    catch (error) {
        console.error("Lỗi khi lấy bài viết theo ID người dùng:", error);
        return response(res, 500, "Lấy bài viết theo ID người dùng thất bại", error.message);
    }
}

// React bài viết
const reactPost = async (req, res) =>
{
    const {postId} = req.params;
    const userId = req.user.userId;
    const {type} = req.body;
    try{
        const post = await Post.findById(postId);
        if(!post) return response(res, 404, "Không tìm thấy bài viết");
        if (!post.reactionStats) {
            post.reactionStats = { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
        }

            // Tìm reaction của user nếu có
            const existingReactionIndex = post.reactions.findIndex(r => r.user.toString() === userId);
            let action = "";
    
            if (existingReactionIndex !== -1) {
                // Nếu đã react, kiểm tra loại reaction
                const existingReaction = post.reactions[existingReactionIndex];
    
                if (existingReaction.type === type) {
                    // Nếu reaction giống nhau => bỏ reaction
                    post.reactions.splice(existingReactionIndex, 1);
                    post.reactionStats[type] = Math.max(0, post.reactionStats[type] - 1);
                    action = "Bỏ reaction thành công";
                } else {
                    // Nếu khác => đổi sang loại mới
                    post.reactionStats[existingReaction.type] = Math.max(0, post.reactionStats[existingReaction.type] - 1);
                    post.reactions[existingReactionIndex].type = type;
                    post.reactionStats[type] = (post.reactionStats[type] || 0) + 1;
                    action = "Cập nhật reaction thành công";
                }
            } else {
                // Nếu chưa react => thêm mới
                post.reactions.push({ user: userId, type });
                post.reactionStats[type] = (post.reactionStats[type] || 0) + 1;
                action = "Thêm reaction thành công";
            }
    /*
            const updatedPost = await post.save();
            return response(res, 200, action, updatedPost);
            */
            await post.save();
            return response(res, 200, action, { reactionStats: post.reactionStats, reactions: post.reactions });
    }
    catch(error) {
        console.error("Lỗi khi thích bài viết:", error);
        return response(res, 500, "Thích bài viết thất bại", error.message);
    }
}

//Thả tym story
const reactStory = async (req, res) =>
{
    const {storyId} = req.params;
    const userId = req.user.userId;
    const {type} = req.body;
    try{
        const story = await Story.findById(storyId);
        if (!story) return response(res, 404, "Không tìm thấy story");

        const existingReactionIndex = story.reactions.findIndex(r => r.user.toString() === userId);

        if (existingReactionIndex !== -1) {
            // Nếu user đã tym => bỏ tym
            story.reactions.splice(existingReactionIndex, 1);
            story.reactionStats.tym = Math.max(0, (story.reactionStats.tym || 0) - 1);
            action = "Đã thích story";
        } else {
            // Nếu chưa tym => thêm tym
            story.reactions.push({ user: userId });
            story.reactionStats.tym = (story.reactionStats.tym || 0) + 1;
            action = "Bỏ thích story";
        }

        await story.save();
        return response(res, 200, action, story);

    } catch (error) {
        console.error("Lỗi khi thả tym story:", error);
        return response(res, 500, "Thả tym story thất bại", error.message);
    }
};

//Bình luận bài viết
const addCommentToPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;
    const { text } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) return response(res, 404, "Không tìm thấy bài viết");

        post.comments.push({ user: userId, text });
        post.commentCount += 1;

        await post.save();
        return response(res, 201, "Bình luận bài viết thành công", post);
    } catch (error) {
        console.error("Lỗi khi bình luận bài viết:", error);
        return response(res, 500, "Bình luận bài viết thất bại", error.message);
    }
};

const addReplyToPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;
    const { commentId, replyText } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return response(res, 404, "Không tìm thấy bài viết");

        const comment = post?.comments?.find(cmt => cmt._id.toString() === commentId);
        if (!comment) return response(res, 404, "Không tìm thấy bình luận");
        
        comment?.replies.push({ user: userId, text:replyText });

        await post.save();
        return response(res, 201, "Phản hồi bình luận thành công", post);
    } catch (error) {
        console.error("Lỗi khi phản hồi bình luận:", error);
        return response(res, 500, "Phản hồi bình luận thất bại", error.message);
    }
};

//Chia sẻ bài viết
const sharePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.userId;

    try {
        const post = await Post.findById(postId);
        if (!post) return response(res, 404, "Không tìm thấy bài viết");

       const hasShared = post.share.includes(userId);
       if (!hasShared) {
           post.share.push(userId);
       }
       post.shareCount += 1;
       await post.save();
       return response(res, 200, "Chia sẻ bài viết thành công", post);
    } catch (error) {
        console.error("Lỗi khi chia sẻ bài viết:", error);
        return response(res, 500, "Chia sẻ bài viết thất bại", error.message);
    }
}
//xóa bài viết
const deletePost = async(req,res) =>{
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) return response(res, 404, "Không tìm thấy bài viết");

       await Post.findByIdAndDelete(postId)
       return response(res, 200, "Xóa bài viết thành công", post);
    } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        return response(res, 500, "Xóa bài viết thất bại", error.message);
    }
}

const deleteStory = async(req,res) =>{
    const { storyId } = req.params;
    try {
        const story = await Story.findById(storyId);
        if (!story) return response(res, 404, "Không tìm thấy story");

       await Story.findByIdAndDelete(storyId)
       return response(res, 200, "Xóa story thành công", story);
    } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        return response(res, 500, "Xóa story thất bại", error.message);
    }
}

const deleteComment = async(req,res) =>{
    const { postId, commentId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) return response(res, 404, "Không tìm thấy bài viết");

        const commentIndex = post?.comments.findIndex((comment)=>comment._id.toString() === commentId)
        if (commentIndex===-1) return response(res, 404, "Không tìm thấy bình luận");

        post.commentCount -= 1;
        post.comments.splice(commentIndex, 1);
        await post.save();
       return response(res, 200, "Xóa bình luận thành công", post);
    } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        return response(res, 500, "Xóa bình luận thất bại", error.message);
    }
}

const deleteReply = async(req,res) =>{
    const { postId, commentId , replyId} = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) return response(res, 404, "Không tìm thấy bài viết");

        const commentIndex = post?.comments.findIndex((comment)=>comment._id.toString() === commentId)
        if (commentIndex===-1) return response(res, 404, "Không tìm thấy bình luận");

        const replyIndex = post?.comments[commentIndex].replies.findIndex((reply)=>reply._id.toString() === replyId)
        if (replyIndex===-1) return response(res, 404, "Không tìm thấy phản hồi");

        post.comments[commentIndex].replies.splice(replyIndex, 1);
        await post.save();
       return response(res, 200, "Xóa phản hồi thành công", post);
    } catch (error) {
        console.error("Lỗi khi xóa phản hồi:", error);
        return response(res, 500, "Xóa phản hồi thất bại", error.message);
    }
}

const getSinglePost = async(req,res) =>{
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId)
        .populate("user", "_id username profilePicture email")
        .populate({
            path: 'comments.user',
            select: 'username profilePicture'
        })
        .populate({
            path: 'comments.replies.user',
            select: 'username profilePicture'
        })
        if (!post) return response(res, 404, "Không tìm thấy bài viết");
        return response(res, 200, "Lấy bài viết thành công", post);
    } catch (error) {
        console.error("Lỗi khi xóa phản hồi:", error);
        return response(res, 500, "Xóa phản hồi thất bại", error.message);
    }
}
const likeComment = async(req,res) =>{
    const { postId } = req.params;
    const userId = req.user.userId;
    const { commentId } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) return response(res, 404, "Không tìm thấy bài viết");

        const comment = post?.comments?.find(cmt => cmt._id.toString() === commentId);
        if (!comment) return response(res, 404, "Không tìm thấy bình luận");
        
        const existingReactionIndex = comment.reactions.findIndex(r => r.user.toString() === userId);

        if (existingReactionIndex !== -1) {
            // Nếu user đã tym => bỏ tym
            comment.reactions.splice(existingReactionIndex, 1);
            action = "Đã thích bình luận";
        } else {
            // Nếu chưa tym => thêm tym
            comment.reactions.push({ user: userId });
            action = "Bỏ thích bình luận";
        }

        await post.save();
        return response(res, 201, "Thích bình luận thành công", post);
    } catch (error) {
        console.error("Lỗi khi thích bình luận:", error);
        return response(res, 500, "Thích bình luận thất bại", error.message);
    }
}

module.exports = { createPost, getAllPosts, getPostByUserId, reactPost, addCommentToPost, addReplyToPost, sharePost, createStory, getAllStories, reactStory, deletePost, deleteComment, deleteReply, getSinglePost, likeComment, editPost, deleteStory };
