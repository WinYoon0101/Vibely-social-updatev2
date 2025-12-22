import { FaRegEdit, FaTrash } from 'react-icons/fa';

const DocumentTable = ({ documents, openModal, setSelectedDoc }) => {

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

    return (
        <table className="w-full border border-gray-400 border-collapse mt-4 bg-white">
            <thead>
                <tr className="border border-gray-400 text-left">
                    <th className="px-2 py-3 w-1/3">Tiêu đề</th>
                    <th className="px-2 py-3 w-3/20">Cấp học</th>
                    <th className="px-2 py-3 w-1/10">Môn học</th>
                    <th className="px-2 py-3 w-1/12 text-center hidden lg:table-cell">Số trang</th>
                    <th className="px-2 py-3 w-1/9 text-center hidden lg:table-cell">Ngày đăng tải</th>
                    <th className="px-2 py-3 w-1/9 text-center hidden lg:table-cell">Ngày cập nhật</th>
                    <th className="px-2 py-3 w-1/9 text-center">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {documents.map((doc) => (
                    <tr key={doc._id} className="border-t border-gray-300 text-left">
                        <td className="px-2 py-3 w-1/3 break-words">{doc.title}</td>
                        <td className="px-2 py-3 w-3/20 md:whitespace-nowrap">{doc.level.name}</td>
                        <td className="px-2 py-3 w-1/10 md:whitespace-nowrap">{doc.subject.name}</td>
                        <td className="px-2 py-3 w-1/12 text-center hidden lg:table-cell">{doc.pages}</td>
                        <td className="px-2 py-3 w-1/9 text-center hidden lg:table-cell">{formatDate(doc.uploadDate)}</td>
                        <td className="px-2 py-3 w-1/9 text-center hidden lg:table-cell">{formatDate(doc.updatedAt)}</td>
                        <td className="px-2 py-3 w-1/9 text-center">
                            <button 
                                className="text-white mb-2 lg:mb-0 lg:mr-2 bg-[#086280] p-[6px] rounded-sm cursor-pointer hover:bg-[#07556F]"
                                onClick={() => {
                                    openModal('updateDocument')
                                    setSelectedDoc(doc)}
                                }
                            >
                                <FaRegEdit />
                            </button>
                            <button 
                                className="text-white bg-red-500 p-[6px] rounded-sm cursor-pointer hover:bg-red-600"
                                onClick={() => {
                                    openModal('deleteDocument')
                                    setSelectedDoc(doc)}
                                }
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DocumentTable;