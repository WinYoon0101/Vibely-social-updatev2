import { addAdmin, approveRequest, createGroup, editGroup, getMyGroups, getOtherGroups, joinGroup, kickMember, leaveGroup, rejectRequest, removeAdmin } from "@/service/group.service";
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
      const res = await joinGroup(groupId);
      const data = res.data; 
      if(res.message === "Joined group successfully"){
        set((state) => ({
          userGroups: [...state.userGroups, data],
          otherGroups: state.otherGroups.filter((group) => group._id !== groupId),
        }));
        toast.success("Tham gia nhóm thành công");
      }else if (res.message === "Waiting for admin approvement"){
        set((state) => ({
          otherGroups: state.otherGroups.map((group) =>
            group._id === groupId ? data : group
          ),
        }));
        toast.success("Vui lòng chờ quản trị viên phê duyệt");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi tham gia nhóm");
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },

  leaveGroup: async(groupId) =>{
    set({ loading: true });
    try {
      const data = await leaveGroup(groupId);
      set((state) => ({
        userGroups: state.userGroups.filter((group) => group !== groupId),
        otherGroups: [...state.otherGroups, data],
      }));
      toast.success("Rời nhóm thành công");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi rời nhóm");
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },

  editGroup: async(groupId,formData) =>{
    set({ loading: true });
    try {
      const data = await editGroup(groupId, formData);
      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group._id === data._id ? data : group
        ),
      }));
    } catch (error) {
      toast.error("Không thể chỉnh sửa nhóm")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },

  addAdmin:async(groupId, userId) =>{
    set({ loading: true });
    try {
      const data = await addAdmin(groupId, userId);
      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group._id === data._id ? data : group
        ),
      }));
    } catch (error) {
      toast.error("Không thể thêm quản trị viên")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },
  removeAdmin:async(groupId, userId) =>{
    set({ loading: true });
    try {
      const data = await removeAdmin(groupId, userId);
      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group._id === data._id ? data : group
        ),
      }));
    } catch (error) {
      toast.error("Không thể xóa quản trị viên")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },
  kickMember:async(groupId, userId) =>{
    set({ loading: true });
    try {
      const data = await kickMember(groupId, userId);
      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group._id === data._id ? data : group
        ),
      }));
    } catch (error) {
      toast.error("Không thể kick thành viên")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },
  approveRequest: async(groupId, userId)=>{
    set({ loading: true });
    try {
      const data = await approveRequest(groupId, userId);
      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group._id === data._id ? data : group
        ),
      }));
    } catch (error) {
      toast.error("Không thể chấp nhận yêu cầu")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  },
  rejectRequest: async(groupId, userId)=>{
    set({ loading: true });
    try {
      const data = await rejectRequest(groupId, userId);
      set((state) => ({
        userGroups: state.userGroups.map((group) =>
          group._id === data._id ? data : group
        ),
      }));
    } catch (error) {
      toast.error("Không thể chấp nhận yêu cầu")
      console.log(error.message);
    }finally {
      set({ loading: false });
    }
  }
}));
