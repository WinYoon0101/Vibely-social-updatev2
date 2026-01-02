const mongoose = require("mongoose");

const NotifSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // dành cho ai
        // ngoại trừ do những người dùng tương tác lẫn nhau, tất cả các loại còn lại do system đảm nhận
        type:{ type: String, enum: ["friends", "posts", "groups", "system"], default: "system" }, 
        content: { type: String, required: true },
        targetId: { type: mongoose.Schema.Types.ObjectId }, // id của bài viết, nhóm, bạn bè liên quan đến thông báo
        isRead: { type: Boolean, default: false },
        // ví dụ: HacThienCau và 15 người khác
        lastSenderId:{ type:String },// dành cho thông báo do người dùng tạo
        senderCount: { type: Number, default: 1  }, // đếm số người gửi để hiển thị trong thông báo
        thumbnailUrl:{ type: String }, // hình thu nhỏ liên quan đến thông báo (nếu có)
    },
    { timestamps: true }
);

const Notification = mongoose.model("Notification", NotifSchema);
module.exports = Notification;
