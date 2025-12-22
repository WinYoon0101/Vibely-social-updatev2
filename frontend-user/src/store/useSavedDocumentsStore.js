import { getSavedDocuments, unsaveDocument } from "@/service/user.service";
import toast from 'react-hot-toast';
import { create } from "zustand";

export const useSavedDocumentsStore = create((set) => ({
    savedDocuments: [],

    loading : false,
    error : null,

    fetchSavedDocuments: async () => {
        set({loading:true})
        try {
            const savedDocuments = await getSavedDocuments();
            set({savedDocuments, loading: false})
        } catch (error) {
            set({error, loading: false})
        }
    },

    unsaveDocument: async (id) => {
        set({loading:true})
        try {
            await unsaveDocument(id);
            set({loading: false})
            toast.success("Đã bỏ lưu tài liệu thành công.")
            set((state) => 
                ({savedDocuments: state.savedDocuments.filter(doc => doc._id !== id)}
            ))
        } catch (error) {
            set({error, loading: false})
            toast.error("Đã xảy ra lỗi khi bỏ lưu tài liệu. Vui lòng thử lại.")
        }
    }
}));
