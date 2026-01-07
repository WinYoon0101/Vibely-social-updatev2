import { uploadFileToCloudinary } from "../config/cloudinary.js";
import Group from "../model/Group.js";
import Notification from "../model/Notification.js";
import Post from "../model/Post.js";
import User from "../model/User.js";
import { getUser } from "../socket.js";

export const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await Group.find({ members: { $in: [userId] } });
    res.status(200).json({ success: true, data: groups ? groups : [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getOtherGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groups = await Group.find({ members: { $nin: [userId] } }).populate(
      "createdBy",
      "username profilePicture"
    );
    res.status(200).json({ success: true, data: groups ? groups : [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate(
      "createdBy",
      "username profilePicture"
    );
    res.status(200).json({ success: true, data: groups ? groups : [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, desc, privacy } = req.body;
    const file = req.file;
    let mediaUrl = null;

    // Kiểm tra nếu có file thì upload lên Cloudinary
    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      if (!uploadResult || !uploadResult.secure_url) {
        return response(res, 400, "Lỗi khi tải lên tệp.");
      }

      mediaUrl = uploadResult.secure_url;
    }
    const newGroup = await Group.create({
      name,
      description: desc,
      privacySetting: privacy == "true" ? "private" : "public",
      coverPhotoUrl: mediaUrl,
      members: [userId],
      admins: [userId],
      createdBy: userId,
    });
    await newGroup.save();
    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already a member of the group",
        });
    }
    if (group.privacySetting === "private") {
      if (!group.waitingRequests.includes(userId)) {
        group.waitingRequests.push(userId);
        await group.save();
      }
      return res.status(200).json({ success: true, data: group, message: "Waiting for admin approvement" });
    }
    group.members.push(userId);
    await group.save();
    return res.status(200).json({ success: true, data: group, message: "Joined group successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
    }
    if(group.createdBy.toString() === userId){
        return res.status(400).json({ success: false, message: "Group creator cannot leave the group" });
    }
    if (!group.members.includes(userId)) {
      res
        .status(400)
        .json({ success: false, message: "User is not a member of the group" });
    }
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== userId
    );
    group.admins = group.admins.filter(
        (adminId) => adminId.toString() !== userId
     );
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).populate(
      "members admins createdBy",
      "username profilePicture"
    );
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getGroupPosts = async (req, res) => {};

export const editGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, desc, privacy, deletePhoto } = req.body;
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).populate(
      "members admins createdBy",
      "username profilePicture"
    );
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
    }
    if(!group.admins.find((adminId) => adminId._id.toString() === userId)){
        return res.status(403).json({ success: false, message: "Only admins can edit the group" });
    }
    const file = req.file;
    
    if(deletePhoto === "true"){
        group.coverPhotoUrl = null;
    }
    
    let mediaUrl = null;
    // Kiểm tra nếu có file thì upload lên Cloudinary
    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      if (!uploadResult || !uploadResult.secure_url) {
        return response(res, 400, "Lỗi khi tải lên tệp.");
      }

      mediaUrl = uploadResult.secure_url;
    }
    if(mediaUrl){
        group.coverPhotoUrl = mediaUrl;
    }

    if (name !== undefined && name !== group.name) {
      group.name = name;
    }
    if (desc !== undefined && desc !== group.description) {
      group.description = desc;
    }
    group.privacySetting = privacy == "true" ? "private" : "public";
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const createGroupPost = async (req, res) => {
  try {
    const userId = req.user.userId;   
    const groupId = req.params.groupId
    const group = await Group.findById(groupId);
    if(!group){
        res.status(404).json({ success: false, message: "Group not found" });
    }
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
        },
        group: groupId
    });
    group.posts.push(newPost._id);
    await newPost.save();
    await group.save();
    res.status(201).json({ success: true, data: newPost });
} catch (error) {
    console.error("Lỗi khi tạo bài viết:", error);
    res.status(500).json({ success: false, message: "Server Error" });
}
};

export const addAdmin = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { groupId, userId: newAdminId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
    }
    if(!group.admins.includes(userId)){
        return res.status(403).json({ success: false, message: "Only admins can add new admins" });
    }
    if (group.admins.includes(newAdminId)) {
      return res
        .status(409)
        .json({ success: false, message: "User is already an admin" });
    }
    if (!group.members.includes(newAdminId)) {
      return res
        .status(400)
        .json({ success: false, message: "User is not a member of the group" });
    }
    group.admins.push(newAdminId);
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Lỗi khi thêm quản trị viên:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const removeAdmin = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { groupId, userId: oldAdminId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
    }
    if(!group.admins.includes(userId)){
        return res.status(403).json({ success: false, message: "Only admins can remove admins" });
    }
    if (!group.admins.includes(oldAdminId)) {
      return res
        .status(400)
        .json({ success: false, message: "User is not an admin" });
    }
    if (!group.members.includes(oldAdminId)) {
      return res
        .status(400)
        .json({ success: false, message: "User is not a member of the group" });
    }
    if(group.createdBy.toString() === oldAdminId){
        return res.status(400).json({ success: false, message: "Cannot remove group creator from admins" });
    }
    group.admins = group.admins.filter(
      (adminId) => adminId.toString() !== oldAdminId
    );
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Lỗi khi xóa quản trị viên:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const kickMember = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { groupId, userId: deletedId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ success: false, message: "Group not found" });
    }
    if (!group.admins.includes(userId)){
        return res.status(403).json({ success: false, message: "Only admins can kick members" });
    }
    if(group.createdBy.toString() === deletedId){
        return res.status(400).json({ success: false, message: "Can not kick the creator" });
    }
    if (!group.members.includes(deletedId)) {
      res
        .status(400)
        .json({ success: false, message: "User is not a member of the group" });
    }
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== deletedId
    );
    group.admins = group.admins.filter(
        (adminId) => adminId.toString() !== deletedId
     );
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Lỗi khi xóa thành viên khỏi nhóm:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getRequests = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.userId;
    const group = await Group.findById(groupId).populate(
      "waitingRequests",
      "username profilePicture"
    );
    if(!group){
        return res.status(404).json({ success: false, message: "Group not found" });
    }
    if (!group.admins.includes(userId)) {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can view requests" });
    }
    res.status(200).json({ success: true, data: group.waitingRequests });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu tham gia nhóm:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const approveRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const { userId: approvedId } = req.body;
    const group = await Group.findById(groupId);
    if(!group){
      return res.status(404).json({ success: false, message: "Group not found" });
  }
  if (!group.admins.includes(userId)) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can approve request" });
  }
  if(!group.waitingRequests.includes(approvedId)){
    return res
      .status(400)
      .json({ success: false, message: "No such request found" });
    }
    group.waitingRequests = group.waitingRequests.filter(
      (requestId) => requestId.toString() !== approvedId
    );
    group.members.push(approvedId);
    const io = req.app.get('io');
    const user = getUser(approvedId);
    const newNotif = new Notification({
      user: approvedId, // gửi cho người được thêm
      type: "groups",
      content: "Yêu cầu tham gia nhóm của bạn đã được chấp nhận.",
      thumbnailUrl: group.coverPhotoUrl,
      targetId: group._id,
      senderCount: 0,
    })
    await newNotif.save();
    if(user){
      io.to(user.socketId).emit("getNotification", newNotif);
    }
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Lỗi khi chấp nhận yêu cầu:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const rejectRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const { userId: approvedId } = req.body;
    const group = await Group.findById(groupId);
    if(!group){
      return res.status(404).json({ success: false, message: "Group not found" });
  }
  if (!group.admins.includes(userId)) {
    return res
      .status(403)
      .json({ success: false, message: "Only admins can reject request" });
  }
  if(!group.waitingRequests.includes(approvedId)){
    return res
      .status(400)
      .json({ success: false, message: "No such request found" });
    }
    group.waitingRequests = group.waitingRequests.filter(
      (requestId) => requestId.toString() !== approvedId
    );
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Lỗi khi từ chối yêu cầu:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const inviteFriend = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const { friendId } = req.body;
    const group = await Group.findById(groupId);
    if(!group){
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    if (!group.members.includes(userId)) {
      return res
        .status(403)
        .json({ success: false, message: "Only members can invite friends" });
    }
    if (group.members.includes(friendId) || group.invitedUsers.includes(friendId)) {
      return res
        .status(409)
        .json({ success: false, message: "User is already a member or has been invited" });
    }
    group.invitedUsers.push(friendId);
    const io = req.app.get('io');
    const user = getUser(friendId);
    const invitePerson = await User.findById(userId);
    const newNotif = new Notification({
      user: friendId, // gửi cho người được thêm
      type: "groups",
      content: `${invitePerson.username} đã mời bạn tham gia nhóm "${group.name}".`,
      thumbnailUrl: group.coverPhotoUrl,
      targetId: group._id,
      senderCount: 0,
    })
    await newNotif.save();
    if(user){
      io.to(user.socketId).emit("getNotification", newNotif);
    }
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Lỗi khi mời bạn bè vào nhóm:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const acceptInvitation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if(!group){
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    if (!group.invitedUsers.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "No invitation found" });
    }
    group.invitedUsers = group.invitedUsers.filter(
      (invitedId) => invitedId.toString() !== userId
    );
    group.members.push(userId);
    await group.save();
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    console.error("Lỗi khi chấp nhận lời mời vào nhóm:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

////// HÀM CỦA ADMIN
export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId)
    if(!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    const creator = await User.findById(group.createdBy);
    if (!creator) {
      return res.status(404).json({ success: false, message: "Group creator not found" });
    }
    const posts = group.posts;
    for (const post of posts){
        await Post.findByIdAndDelete(post);
    }
    const newNotif = new Notification({
      user: creator._id,
      type: "system",
      content: `Nhóm "${group.name}" của bạn đã bị xóa bởi quản trị viên hệ thống. Chúng tôi rất tiếc về điều này.`,
      thumbnailUrl: group.coverPhotoUrl || "https://tse3.mm.bing.net/th/id/OIP.F-JvlOPJN0M9wJq4PVuRJAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      targetId: null,
      senderCount: 0,
    })
    await newNotif.save();
    const io = req.app.get('io');
    const user = getUser(creator._id);
    if(user){
      io.to(user.socketId).emit("getNotification", newNotif);
    }
    await Group.findByIdAndDelete(groupId);
    return res.status(200).json({success: true, message: "Group deleted successfully"});
  } catch (error) {
    console.error("Lỗi khi xóa nhóm:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}