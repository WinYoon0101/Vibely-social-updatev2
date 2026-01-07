const User = require("../model/User");
const Post = require("../model/Post");
const Story = require("../model/Story");
const Group = require("../model/Group");
const Inquiry = require("../model/Inquiry");
const Notification = require("../model/Notification");

// Lấy danh sách tất cả users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password')
            .populate('posts', '_id')
            .populate('followers', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách người dùng',
            error: error.message
        });
    }
};

// Xóa user theo ID
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra user có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        //Tìm tất cả bài viết mà user này đã comment, reply hoặc react
        const posts = await Post.find({
            $or: [
                { user: userId },
                { "comments.user": userId },
                { "comments.replies.user": userId },
                { "reactions.user._id": userId },
                { "comments.reactions.user": userId }
            ]
        });

        for (const post of posts) {

            if (post.user._id.toString() === userId) {
                await Post.findByIdAndDelete(post._id);
                continue;
            }

            // Xóa tất cả comments của user
            post.comments = post.comments.filter(comment => comment.user._id.toString() !== userId);
            post.commentCount = post.comments.length;

            // Xóa tất cả replies của user trong comments
            post.comments.forEach(comment => {
                comment.replies = comment.replies.filter(reply => reply.user._id.toString() !== userId);
            });

            // Xóa tất cả reactions của user trên bài viết
            post.reactions = post.reactions.filter(reaction => reaction.user._id.toString() !== userId);
            // Cập nhật lại reactionStats
            post.reactionStats = {
                like: post.reactions.filter(r => r.type === "like").length,
                love: post.reactions.filter(r => r.type === "love").length,
                haha: post.reactions.filter(r => r.type === "haha").length,
                wow: post.reactions.filter(r => r.type === "wow").length,
                sad: post.reactions.filter(r => r.type === "sad").length,
                angry: post.reactions.filter(r => r.type === "angry").length
            };

            // Xóa tất cả reactions của user trên comments
            post.comments.forEach(comment => {
                comment.reactions = comment.reactions.filter(reaction => reaction.user.toString() !== userId);
            });

            await post.save();
        }

        const stories = await Story.find({
            $or: [
                { "user": userId },
                { "reactions.user": userId },
            ]
        });
        for (const story of stories) {
            if (story.user._id.toString() === userId) {
                await Story.findByIdAndDelete(story._id);
                continue;
            }
            // Xóa tất cả reactions của user trên bài viết
            story.reactions = story.reactions.filter(reaction => reaction.user.toString() !== userId);

            // Cập nhật lại reactionStats
            story.reactionStats = {
                "tym": story.reactions.length,
            }
            await story.save();
        }
        // Xóa user khỏi danh sách follower của những người khác
        await User.updateMany(
            { followers: userId },
            { $pull: { followers: userId }, $inc: { followerCount: -1 } }
        );

        // Xóa user khỏi danh sách following của những người khác
        await User.updateMany(
            { followings: userId },
            { $pull: { followings: userId }, $inc: { followingCount: -1 } }
        );

        const groupsAsLastAdmin = await Group.find({
            admins: { $size: 1 }, 
            admins: userId        // là admin cuối cùng
        });
        for (const group of groupsAsLastAdmin) {
            // Tìm thành viên khác trong nhóm
            const nextAdmin = group.members.find(m => m.toString() !== userId.toString());
            if (nextAdmin) {
                await Group.updateOne(
                    { _id: group._id },
                    { $push: { admins: nextAdmin } }
                );
            } else {
                await Group.deleteOne({ _id: group._id });
            }
        }
        await Group.updateMany(
            { members: userId },
            { $pull: { members: userId } }
        )
        await Group.updateMany(
            { admins: userId },
            { $pull: { admins: userId } }
        )
                
        await Inquiry.deleteMany({ userId: userId });

        await Notification.deleteMany({ user: userId });

        // Xóa user
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa người dùng',
            error: error.message
        });
    }
};

// Tìm kiếm users
exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }, '-password')
            .populate('posts', '_id')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error in searchUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tìm kiếm người dùng',
            error: error.message
        });
    }
}; 

// Lấy danh sách bạn chung
exports.getAllFriends = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
        .select('followers followings')
        .populate('followings', 'username profilePicture email followerCount followingCount')
        .populate('followers','username profilePicture email followerCount followingCount')

        if(!user){
            res.status(404).json({
                success: false,
                message: 'Người dùng không tồn tại'
            })
        }

        // Tạo một tập hợp id người dùng mà người đăng nhập đang theo dõi
        const followingUserId = new Set(user.followings.map(user => user._id.toString()))

        // Lọc người theo dõi của người đăng nhập để chỉ lấy những người được theo dõi bởi người đăng nhập
        const mutualFriends = user.followers.filter(follower => 
            followingUserId.has(follower._id.toString())
        )

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách bạn chung thành công',
            data: mutualFriends
        })

   } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách bạn chung',
            error: error.message
        })
   }
}