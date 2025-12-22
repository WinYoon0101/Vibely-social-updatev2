"use client";
import LeftSideBar from "@/app/components/LeftSideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { BookMarked, CalendarDays, Copy, GraduationCap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoBookmarkSlashFill } from "react-icons/go";
import { IoIosShareAlt } from "react-icons/io";

const SavedDocumentDetail = () => {
    const { id } = useParams();
    const router = useRouter();

    const [document, setDocument] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [token, setToken] = useState(null);
    const [isSharePopupOpen, setSharePopupOpen] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    // Hàm chuyển đổi ngày tháng năm
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    };

    // Lấy token từ localStorage trên client
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.error("Lỗi: Không tìm thấy token");
        }
    }, []);

    // Gọi API để lấy chi tiết tài liệu
    useEffect(() => {
        if (id && token) {
            const fetchDocument = async () => {
                if (!token) return;

                try {
                    const result = await axios.get(`${API_URL}/users/saved/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    setDocument(result.data.data);
                } catch (err) {
                    console.error("Lỗi khi lấy chi tiết tài liệu:", err);
                }
            };

            fetchDocument();
        }
    }, [id, token]);

    // Hàm bỏ lưu tài liệu
    const unsaveDocument = async () => {
        if (!token) {
            toast.error("Bạn cần đăng nhập để bỏ lưu tài liệu.");
            return;
        }

        try {
            const response = await axios.delete(
                `${API_URL}/users/saved/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Bỏ lưu tài liệu thành công!");

            // Chuyển hướng về trang tài liệu đã lưu
            router.replace("/saved");

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error("Lỗi khi bỏ lưu tài liệu:", error.response?.data?.message || error.message);
        }
    };

    // Hàm sao chép liên kết
    const copyToClipboard = () => {
        const link = window.location.href;
        navigator.clipboard.writeText(link)
            .then(() => toast.success("Đã sao chép liên kết!"))
            .catch(() => toast.error("Lỗi khi sao chép"));
    };

    if (!document) {
        return <div className="text-center mt-20 text-xl">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="flex h-screen p-5 bg-background pt-16 justify-center lg:justify-between">
            {/* Thanh bên */}
            <div className="md:hidden">
                <LeftSideBar />
            </div>
            {/* Nút mở rộng khi màn hình nhỏ*/}
            <Button
                variant="bigIcon"
                className="flex lg:hidden hover:bg-gray-100 absolute left-0 top-15"
                onClick={() => { setSidebarOpen(true) }}
            >
                <GiHamburgerMenu style={{ width: 24, height: 24 }} />
            </Button>

            {/*Nội dung thanh bên*/}
            <div className={`fixed top-14 left-0 lg:h-full sm:w-2/5 w-3/4 p-5 pt-8 bg-white z-50 transform transition-transform duration-300  
                ${isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
                lg:translate-x-0 lg:static lg:w-1/5 rounded-xl shadow-lg overflow-auto flex flex-col h-[calc(100vh-3.5rem)]`}
            >
                {/*Nút đóng sidebar*/}
                <Button variant="bigIcon" className="lg:hidden absolute top-1 right-0" onClick={() => setSidebarOpen(false)}>
                    <AiOutlineClose style={{ width: 24, height: 24, color: "black" }} />
                </Button>

                <div className="min-h-0 flex-1">
                    <h2 className="text-xl font-bold">{document.title}</h2>
                    <div className="mt-5 space-y-3">
                        <p className="flex items-center">
                            <span className="mr-3"><BookMarked size={20} /></span>
                            <span>Môn học</span>
                        </p>
                        <p className="font-bold ml-8">{document.subject.name}</p>

                        <p className="flex items-center">
                            <span className="mr-3"><GraduationCap size={20} /></span>
                            <span>Cấp bậc</span>
                        </p>
                        <p className="font-bold ml-8">{document.level.name}</p>

                        <p className="flex items-center">
                            <span className="mr-3"><CalendarDays size={20} /></span>
                            <span>Ngày đăng</span>
                        </p>
                        <p className="font-bold ml-8">{formatDate(document.uploadDate)}</p>
                    </div>
                </div>


                <div className="mt-auto space-y-3">
                    <Button
                        variant="default"
                        size="lg"
                        className="w-full bg-[#086280] hover:bg-[#07556F] text-white rounded-lg flex items-center justify-center text-[16px]"
                        onClick={() => document?._id && unsaveDocument()}
                        disabled={!document?._id}
                    >
                        <GoBookmarkSlashFill /> Bỏ lưu tài liệu
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="w-full bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-[16px]"
                        onClick={() => setSharePopupOpen(true)}
                    >
                        <IoIosShareAlt /> Chia sẻ tài liệu
                    </Button>
                </div>
            </div>

            {/* Nội dung tài liệu bên phải */}
            <div className="flex-1 pr-7 pl-12 pt-8 pb-0">
                <iframe
                    src={document.fileUrl.replace("/view", "/preview")}
                    width="100%"
                    height="100%"
                    allow="autoplay"
                    className="border border-gray-300 rounded-lg shadow-lg"
                ></iframe>
            </div>

            {/* Popup chia sẻ */}
            {isSharePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h3 className="text-lg font-bold mb-3">Chia sẻ tài liệu</h3>
                        <p className="text-sm mb-1 text-gray-500">Sao chép liên kết dưới đây để chia sẻ tài liệu cho mọi người</p>
                        <div className="flex items-center py-2 px-0">
                            <Input
                                type="text"
                                value={window.location.href}
                                readOnly
                                className="flex-1 outline-none bg-transparent text-sm border border-gray-400 p-2 rounded-md"
                            />
                            <Button
                                variant="default"
                                className="ml-2 text-white bg-[#086280] hover:bg-[#07556F] w-9 h-9"
                                onClick={copyToClipboard}
                            >
                                <Copy />
                            </Button>
                        </div>
                        <div className="mt-2 flex justify-end">
                            <Button
                                variant="ghost"
                                className="bg-gray-200 hover:bg-gray-300"
                                onClick={() => setSharePopupOpen(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SavedDocumentDetail;
