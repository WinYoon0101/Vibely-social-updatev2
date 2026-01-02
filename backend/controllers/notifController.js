import Notification from "../model/Notification.js";
import { getUser } from "../socket.js";

export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifs = await Notification.find({ user: userId })
            .sort({ updatedAt: -1 })
            .limit(50)
        return res.status(200).json({ success: true, data: notifs || [] });
    } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifId = req.params.notifId;
        const notif = await Notification.findOne({ _id: notifId, user: userId });
        if (!notif) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông báo" });
        }
        notif.isRead = true;
        await notif.save();
        return res.status(200).json({ success: true, message: "Đã đánh dấu thông báo là đã đọc" });
    } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const markAsUnread = async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifId = req.params.notifId;
        const notif = await Notification.findOne({ _id: notifId, user: userId });
        if (!notif) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông báo" });
        }
        notif.isRead = false;
        await notif.save();
        return res.status(200).json({ success: true, message: "Đã đánh dấu thông báo là chưa đọc" });
    } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo là chưa đọc:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        await Notification.updateMany(
            { user: userId, isRead: false },
            { $set: { isRead: true } }
        );
        return res.status(200).json({ success: true, message: "Đã đánh dấu tất cả thông báo là đã đọc" });
    } catch (error) {
        console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}