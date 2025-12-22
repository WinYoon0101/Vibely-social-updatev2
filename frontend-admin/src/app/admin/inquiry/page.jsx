'use client';

import Sidebar from '@/app/components/sidebar/Sidebar';
import DeleteInquiryPopup from "@/app/components/support/popup/DeleteInquiryPopup";
import ResponseInquiryPopup from "@/app/components/support/popup/ResponseInquiryPopup";
import SearchBar from "@/app/components/support/SearchBar";
import SupportTable from "@/app/components/support/SupportTable";
import { deleteInquiry, getInquiries, updateInquiry } from '@/service/inquiryAdmin.service';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";

const Inquiry = () => {
    const [modalType, setModalType] = useState(null);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const [inquiries, setInquiries] = useState([]);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");

    // Lấy danh sách thắc mắc
    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const data = await getInquiries(query, status);
                setInquiries(data.data);
            } catch (err) {
                toast.error("Lỗi khi lấy danh sách thắc mắc");
            }
        };

        fetchInquiries();
    }, [query, status]);

    const handleSearch = (q, s) => {
        setQuery(q !== undefined ? q : query);
        setStatus(s !== undefined ? s : status);
    };

    // Xóa thắc mắc
    const handleDeleteInquiry = async () => {
        if (!selectedInquiry?._id) return;

        try {
            await deleteInquiry(selectedInquiry._id);
            setInquiries((prev) => prev.filter((inquiry) => inquiry._id !== selectedInquiry._id));
            toast.success("Xóa thắc mắc thành công!");
            setSelectedInquiry(null);
            closeModal();
        } catch (err) {
            toast.error("Xóa thắc mắc thất bại!");
        }
    }

    // Cập nhật thắc mắc
    const handleUpdateInquiry = async (inquiry) => {
        try {
            const data = await updateInquiry(inquiry.inquiryId, {
                status: "Đã phản hồi",
                response: inquiry.response,
            });

            const updatedInquiry = data.inquiry;
            setInquiries((prev) => prev.map((inquiry) => (inquiry._id === updatedInquiry._id ? updatedInquiry : inquiry)));
            toast.success("Phản hồi thắc mắc thành công!");
            setSelectedInquiry(null);
            closeModal();
        } catch (err) {
            toast.error("Phản hồi thắc mắc thất bại!");
        }
    }

    const openModal = (type) => {
        setModalType(type);
    };

    const closeModal = () => setModalType(null);

    return (
        <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
            <Sidebar />
            {/* Nội dung chính */}
            <div className="w-full md:w-4/5 md:ml-52 py-6 px-6 overflow-y-auto">
                <h1 className="text-2xl font-semibold text-[#333]">Quản lý thắc mắc</h1>
                <SearchBar onSearch={handleSearch} initialQuery={query} initialStatus={status} />
                <SupportTable inquiries={inquiries} openModal={openModal} setSelectedInquiry={setSelectedInquiry} />
            </div>

            {modalType === "responseInquiry" && (
                <ResponseInquiryPopup isOpen inquiry={selectedInquiry} onUpdate={handleUpdateInquiry} onClose={closeModal} />
            )}

            {modalType === "deleteInquiry" && (
                <DeleteInquiryPopup isOpen onConfirm={handleDeleteInquiry} onClose={closeModal} />
            )}
        </div>
    );
}

export default Inquiry; 