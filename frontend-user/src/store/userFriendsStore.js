import {
  deleteUserFromRequest,
  followUser,
  getAllFriendsRequest,
  getAllFriendsSuggestion,
  getMutualFriends,
  UnfollowUser,
} from "@/service/user.service";
import toast from "react-hot-toast";
import { create } from "zustand";

export const userFriendStore = create((set, get) => ({
  friendRequest: [],
  friendSuggestion: [],
  mutualFriends: [],
  loading: false,

  fetchFriendRequest: async () => {
    set({ loading: true });
    try {
      const friend = await getAllFriendsRequest();
      set({ friendRequest: friend.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  fetchFriendSuggestion: async () => {
    set({ loading: true });
    try {
      const friend = await getAllFriendsSuggestion();
      set({ friendSuggestion: friend.data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  fetchMutualFriends: async (userId) => {
    set({ loading: true });
    try {
      const friend = await getMutualFriends(userId);
      set({ mutualFriends: friend, loading: false });
    } catch (error) {
      set({ error, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  followUser: async (userId, action) => {
    try {
      await followUser(userId);
      if (action === "makeFriend") {
        toast.success("Gửi lời mời kết bạn thành công!");
      } else if (action === "confirm") {
        toast.success("Kết bạn thành công!");
      }
    } catch (error) {
      toast.error("Gửi lời mời kết bạn thất bại!");
    }
  },

  UnfollowUser: async (userId) => {
    try {
      await UnfollowUser(userId);
    } catch (error) {
      toast.error("Hủy kết bạn thất bại!");
    }
  },

  deleteUserFromRequest: async (userId) => {
    try {
      await deleteUserFromRequest(userId);
      toast.success("Xóa lời mời kết bạn thành công!");
    } catch (error) {
      toast.error("Xóa lời mời kết bạn thất bại!");
    }
  },
}));
