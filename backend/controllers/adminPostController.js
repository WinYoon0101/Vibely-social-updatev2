const Post = require("../model/Post");
const Group = require("../model/Group");
const response = require("../utils/responseHandler");
const Notification = require("../model/Notification");

//Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      })
      .populate({
        path: "comments.replies.user",
        select: "username profilePicture",
      })
      .populate({
        path: "reactions.user",
        select: "username profilePicture",
      })
      .populate({
        path: "group",
        select: "name description privacySetting coverPhotoUrl",
      });
    return response(res, 200, "Lấy tất cả bài viết thành công", posts);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả bài viết:", error);
    return response(res, 500, "Lấy tất cả bài viết thất bại", error.message);
  }
};

exports.getSinglePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId)
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      })
      .populate({
        path: "comments.replies.user",
        select: "username profilePicture",
      })
      .populate({
        path: "reactions.user",
        select: "username profilePicture",
      })
      .populate({
        path: "group",
        select: "name description privacySetting coverPhotoUrl",
      });
    if (!post) return response(res, 404, "Không tìm thấy bài viết");
    if (post.group && post.group.privacySetting === "private") {
      const group = await Group.findById(post.group._id);
      if (!group.members.includes(req.user.userId)) {
        return response(res, 403, "Bạn không có quyền truy cập bài viết này");
      }
    }
    return response(res, 200, "Lấy bài viết thành công", post);
  } catch (error) {
    console.error("Lỗi khi xóa phản hồi:", error);
    return response(res, 500, "Xóa phản hồi thất bại", error.message);
  }
};

//Lấy bài viết theo ID người dùng
exports.getPostByUserId = async (req, res) => {
  const userId = req.params.id;
  try {
    if (!userId) {
      return response(res, 400, "Yêu cầu mã người dùng để lấy bài viết");
    }
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      })
      .populate({
        path: "comments.replies.user",
        select: "username profilePicture",
      })
      .populate({
        path: "group",
        select: "name description privacySetting coverPhotoUrl",
      });
    return response(
      res,
      200,
      "Lấy bài viết theo ID người dùng thành công",
      posts
    );
  } catch (error) {
    console.error("Lỗi khi lấy bài viết theo ID người dùng:", error);
    return response(
      res,
      500,
      "Lấy bài viết theo ID người dùng thất bại",
      error.message
    );
  }
};

//xóa bài viết
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return response(res, 404, "Không tìm thấy bài viết");
    if (post.group) {
      // Nếu bài viết thuộc nhóm, cập nhật xóa mã bài viết trong nhóm
      const group = await Group.findById(post.group);
      if (group) {
        group.posts = group.posts.filter((id) => id.toString() !== postId);
        await group.save();
      }
    }
    const notifs = await Notification.find({ targetId: post._id });
    for (const notif of notifs) {
      await Notification.findByIdAndDelete(notif._id);
    }
    await Post.findByIdAndDelete(postId);
    return response(res, 200, "Xóa bài viết thành công", post);
  } catch (error) {
    console.error("Lỗi khi xóa bài viết:", error);
    return response(res, 500, "Xóa bài viết thất bại", error.message);
  }
};

exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return response(res, 404, "Không tìm thấy bài viết");

    const commentIndex = post?.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1)
      return response(res, 404, "Không tìm thấy bình luận");

    post.commentCount -= 1;
    post.comments.splice(commentIndex, 1);
    await post.save();
    return response(res, 200, "Xóa bình luận thành công", post);
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    return response(res, 500, "Xóa bình luận thất bại", error.message);
  }
};

exports.deleteReply = async (req, res) => {
  const { postId, commentId, replyId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return response(res, 404, "Không tìm thấy bài viết");

    const commentIndex = post?.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1)
      return response(res, 404, "Không tìm thấy bình luận");

    const replyIndex = post?.comments[commentIndex].replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    if (replyIndex === -1) return response(res, 404, "Không tìm thấy phản hồi");

    post.comments[commentIndex].replies.splice(replyIndex, 1);
    await post.save();
    return response(res, 200, "Xóa phản hồi thành công", post);
  } catch (error) {
    console.error("Lỗi khi xóa phản hồi:", error);
    return response(res, 500, "Xóa phản hồi thất bại", error.message);
  }
};
