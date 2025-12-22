"use client";
import SearchDocument from "@/app/components/SearchDocument";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import 'react-h5-audio-player/lib/styles.css';
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import LeftSideBar from "../components/LeftSideBar";

const DocumentPage = () => {
    const router = useRouter();

    const [levels, setLevels] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [selectedLevelId, setSelectedLevelId] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [token, setToken] = useState(null);
    const [query, setQuery] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    // Lấy token từ localStorage trên client
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Gọi API để lấy cấp học và danh sách tài liệu ban đầu
    useEffect(() => {
        const fetchLevel = async () => {
            if (!token) return;

            try {
                const levelsRes = await axios.get(`${API_URL}/documents/levels`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLevels(levelsRes.data.data);

                const docsRes = await axios.get(`${API_URL}/documents`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDocuments(docsRes.data.data);
            } catch (err) {
                toast.error("Lỗi khi lấy dữ liệu ban đầu");
            }
        };

        fetchLevel();
    }, [token]);

    // Gọi API lấy danh sách môn học khi chọn cấp học
    useEffect(() => {
        const fetchSubjects = async () => {
            if (!selectedLevelId) {
                setSubjects([]);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/documents/subjects/${selectedLevelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setSubjects(res.data.data);
            } catch (err) {
                toast.error("Lỗi khi lấy danh sách môn học");
            }
        };

        fetchSubjects();
    }, [selectedLevelId, token]);

    // Gọi API để tìm kiếm tài liệu theo query và lọc theo cấp học, môn học
    useEffect(() => {
        const fetchFilteredDocs = async () => {
            if (!token) return;

            let url = `${API_URL}/documents?`;
            if (query) url += `query=${query}&`;
            if (selectedLevelId) url += `level=${selectedLevelId}&`;
            if (selectedSubjectId) url += `subject=${selectedSubjectId}`;

            try {
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDocuments(res.data.data);
            } catch (err) {
                toast.error("Lỗi khi tìm kiếm tài liệu");
            }
        };

        fetchFilteredDocs();
    }, [query, selectedLevelId, selectedSubjectId, token]);


    return (
        <div className="flex h-screen p-5 bg-background pt-16 justify-center lg:justify-between">
            {/* Thanh bên */}
            <div className="md:hidden">
                <LeftSideBar/>
            </div>            
            <Button
                variant="bigIcon"
                className="flex lg:hidden hover:bg-gray-100 absolute left-0 top-15"
                onClick={() => { setSidebarOpen(true) }}
            >
                <GiHamburgerMenu style={{ width: 24, height: 24 }} />
            </Button>

            {/*Nội dung thanh bên*/}
            <div className={`fixed top-14 left-0 h-full sm:w-2/5 w-3/4 p-5 bg-white z-50 transform transition-transform duration-300  
                ${isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
                lg:translate-x-0 lg:static lg:w-1/5 rounded-xl shadow-lg overflow-auto`}
            >

                <Button variant="bigIcon" className="lg:hidden absolute top-4 right-2" onClick={() => setSidebarOpen(false)}>
                    <AiOutlineClose style={{ width: 24, height: 24, color: "black" }} />
                </Button>

                <p className="font-bold text-xl mb-4">Tài liệu</p>

                <SearchDocument onSearch={setQuery} initialQuery={query} />

                <Separator className="mt-1 mb-4 border-b border-gray-300" />

                {/* Danh sách cấp học */}
                <div className="flex flex-col">
                    <div
                        key="all-levels"
                        className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                            ${selectedLevelId === null ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                        onClick={() => {
                            setSelectedLevelId(null);
                            setSelectedSubjectId(null);
                        }}
                    >
                        Tất cả cấp học
                    </div>
                    {levels.map((level) => (
                        <div
                            key={level._id}
                            className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                                ${selectedLevelId === level._id ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                            onClick={() => {
                                setSelectedLevelId(level._id);
                                setSelectedSubjectId(null);
                            }}
                        >
                            {level.name}
                        </div>
                    ))}
                </div>

                <Separator className="mt-1 mb-4 border-b border-gray-300" />

                {/* Danh sách môn học */}
                {selectedLevelId && (
                    <div className="flex flex-col">
                        <div
                            key="all-subjects"
                            className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                                ${selectedSubjectId === null ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                            onClick={() => setSelectedSubjectId(null)}
                        >
                            Tất cả môn học
                        </div>
                        {subjects.map((subject) => (
                            <div
                                key={subject._id}
                                className={`w-full px-4 py-2 rounded-lg cursor-pointer 
                                    ${selectedSubjectId === subject._id ? "bg-[#086280] text-white" : "bg-white hover:bg-gray-200"}`}
                                onClick={() => setSelectedSubjectId(subject._id)}
                            >
                                {subject.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Danh sách tài liệu */}
            <div className="flex-1 p-4">
                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
                    {documents.map((doc) => (
                        <div
                            key={doc._id}
                            className="border border-gray-300 p-4 rounded-lg shadow-md bg-white cursor-pointer 
                                hover:shadow-xl transition-all duration-200 ease-in hover:bg-[#086280]/15"
                            onClick={() => router.push(`/document/${doc._id}`)}
                        >
                            <div className="flex justify-center mb-3">
                                <img
                                    src={doc.fileType === "pdf" ? "/images/pdf-icon.png" : "/images/docx-icon.png"}
                                    alt="File Icon"
                                    className="h-28"
                                />
                            </div>
                            <h3 className="font-semibold text-[18px]">{truncateText(doc.title, 50)}</h3>
                            <p className="text-[13px] font-semibold mt-1 italic">{doc.pages} trang</p>
                            <div className="flex justify-between mt-2">
                                <p className="text-[13px] text-gray-500 font-semibold italic">{doc.level.name}</p>
                                <p className="text-[13px] text-gray-500 font-semibold italic">{doc.subject.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DocumentPage;