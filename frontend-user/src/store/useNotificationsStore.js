import {
  getMyNotifications,
  setAllAsRead,
  setAsRead,
  setAsUnread,
} from "@/service/notification.service";
import toast from "react-hot-toast";
import { create } from "zustand";

export const userNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: true,

  updateUnread: () =>
    set((state) => {
      {
        const unreadCount = state.notifications.reduce((count, notif) => {
          return notif.isRead ? count : count + 1;
        }, 0);
        return { unreadCount };
      }
    }),
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await getMyNotifications();
      set({ notifications: response || [] });
      get().updateUnread();
    } catch (error) {
      console.error("Lỗi khi tải thông báo:", error);
      toast.error("Lỗi khi tải thông báo");
    } finally {
      set({ loading: false });
    }
  },
  addNotification: async (notif) => {
    set((state) => ({
      notifications: [notif, ...state.notifications],
    }));
    get().updateUnread();
  },
  setAsRead: async(notifId) => {
    try {
        const response = await setAsRead(notifId)
        if (response.success) {
          set((state) => ({
            notifications: state.notifications.map((notif) =>
              notif._id === notifId ? { ...notif, isRead: true } : notif
            ),
            unreadCount: state.unreadCount - 1,
          }));
          toast.success("Đã đánh dấu thông báo là đã đọc");
        } else {
          toast.error("Lỗi khi đánh dấu thông báo là đã đọc");
        }
      } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
        toast.error("Lỗi khi đánh dấu thông báo là đã đọc");
      }
  },
  setAsUnread: async(notifId) => {
    try {
        const response = await setAsUnread(notifId)
        if (response.success) {
          set((state) => ({
            notifications: state.notifications.map((notif) =>
              notif._id === notifId ? { ...notif, isRead: false } : notif
            ),
            unreadCount: state.unreadCount + 1,
          }));
          toast.success("Đã đánh dấu thông báo là chưa đọc");
        } else {
          toast.error("Lỗi khi đánh dấu thông báo là chưa đọc");
        }
      } catch (error) {
        console.error("Lỗi khi đánh dấu thông báo là chưa đọc:", error);
        toast.error("Lỗi khi đánh dấu thông báo là chưa đọc");
      }
  },
  setAllAsRead: async () => {
    try {
      const response = await setAllAsRead();
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            isRead: true,
          })),
          unreadCount: 0,
        }));
        toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
      } else {
        toast.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc");
      }
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
      toast.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc");
    }
  },
}));
