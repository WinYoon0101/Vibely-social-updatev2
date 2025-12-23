import { createGroup, getMyGroups, getOtherGroups, joinGroup } from "@/service/group.service";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useUserGroupsStore = create((set, get) => ({
  userGroups: [],
  otherGroups:[],
  loading: false,

  fetchUserGroups: async () => {
    set({ loading: true });
    try {
      const data = await getMyGroups();
      set({ userGroups: data });
    } catch (error) {
      toast.error("Không thể lấy dữ liệu nhóm")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },

  createGroup: async(formData) =>{
    set({ loading: true });
    try {
      const data = await createGroup(formData); // group mới
      set((state) => ({ userGroups: [...state.userGroups, data] }));
    } catch (error) {
      toast.error("Không thể tạo nhóm")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },

  fetchOtherGroups: async () => {
    set({ loading: true });
    try {
      const data = await getOtherGroups();
      set({ otherGroups: data });
      
    } catch (error) {
      toast.error("Không thể lấy dữ liệu nhóm");
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },
    

  joinGroup: async(groupId) =>{
    set({ loading: true });
    try {
      const data = await joinGroup(groupId);
      set((state) => ({
        userGroups: [...state.userGroups, data],
        otherGroups: state.otherGroups.filter((group) => group._id !== groupId),
      }));
      toast.success("Tham gia nhóm thành công");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi tham gia nhóm");
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },
  leaveGroup: (groupId) =>
    set((state) => ({
      userGroups: state.userGroups.filter((group) => group.id !== groupId),
    })),
}));
