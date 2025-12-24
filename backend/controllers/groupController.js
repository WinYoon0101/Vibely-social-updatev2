import { uploadFileToCloudinary } from "../config/cloudinary.js";
import Group from "../model/Group.js";
import Post from "../model/Post.js";

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
      res.status(404).json({ success: false, message: "Group not found" });
    }
    if (group.members.includes(userId)) {
      res
        .status(400)
        .json({
          success: false,
          message: "User already a member of the group",
        });
    }
    group.members.push(userId);
    await group.save();
    res.status(200).json({ success: true, data: group });
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