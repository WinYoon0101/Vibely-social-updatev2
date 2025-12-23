import { uploadFileToCloudinary } from "../config/cloudinary.js";
import Group from "../model/Group.js";

export const getMyGroups = async (req,res)=>{
    try {
        const userId = req.user.userId;  
        const groups = await Group.find({ members: { $in: [userId] } })
        res.status(200).json({ success: true, data: groups ? groups : [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getOtherGroups = async (req,res)=>{
    try {
        const userId = req.user.userId;  
        const groups = await Group.find({ members: { $nin: [userId] } }).populate('createdBy', 'username profilePicture');
        res.status(200).json({ success: true, data: groups ? groups : [] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const createGroup = async (req,res)=>{
    try {
        const userId = req.user.userId;  
        const {name, desc, privacy} = req.body;
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
            privacySetting: privacy==true?"private":"public",
            coverPhotoUrl: mediaUrl,
            members: [userId],
            admins: [userId],
            createdBy: userId
        });
        await newGroup.save();
        res.status(201).json({ success: true, data: newGroup });
    }catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const joinGroup = async (req,res)=>{
    try {
        const userId = req.user.userId;  
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group){
            res.status(404).json({ success: false, message: "Group not found" });
        }
        if (group.members.includes(userId)){
            res.status(400).json({ success: false, message: "User already a member of the group" });
        }
        group.members.push(userId);
        await group.save();
        res.status(200).json({ success: true, data: group });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}