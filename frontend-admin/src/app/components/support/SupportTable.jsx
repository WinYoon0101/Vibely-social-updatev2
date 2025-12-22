import { FaTrash } from 'react-icons/fa';

const SupportTable = ({ inquiries, openModal, setSelectedInquiry }) => {

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
                    <th className="px-2 py-3 w-1/7">Tên người dùng</th>
                    <th className="px-2 py-3 w-67/315">Email</th>
                    <th className="px-2 py-3 w-1/2 md:w-7/20">Nội dung thắc mắc</th>
                    <th className="px-2 py-3 w-1/12 text-center hidden lg:table-cell">Ngày gửi</th>
                    <th className="px-2 py-3 w-1/9 text-center">Trạng thái</th>
                    <th className="px-2 py-3 w-1/10 text-center">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {inquiries.map((inq) => (
                    <tr key={inq._id} className="border-t border-gray-300 text-left">
                        <td className="px-2 py-3 w-1/7">{inq.userId.username}</td>
                        <td className="px-2 py-3 w-67/315 break-all">{inq.userId.email}</td>
                        <td className="px-2 py-3 w-1/2 md:w-7/20 break-words">{inq.message}</td>
                        <td className="px-2 py-3 w-1/12 text-center hidden lg:table-cell">{formatDate(inq.createdAt)}</td>
                        <td className="px-2 py-3 w-1/9 text-center">{inq.status}</td>
                        <td className="px-2 py-3 w-1/10 text-center">
                            {inq.status === 'Chưa phản hồi' && (
                                <button 
                                    className="text-white mb-2 lg:mb-0 lg:mr-2 bg-[#086280] p-[6px] rounded-sm cursor-pointer hover:bg-[#07556F]"
                                    onClick={() => {
                                        openModal('responseInquiry')
                                        setSelectedInquiry(inq)}
                                    }
                                >
                                    <img src="/images/reply.svg" alt="" className='w-4 h-4'/>
                                </button>
                            )}
                            <button 
                                className="text-white bg-red-500 p-[6px] rounded-sm cursor-pointer hover:bg-red-600"
                                onClick={() => {
                                    openModal('deleteInquiry')
                                    setSelectedInquiry(inq)}
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

export default SupportTable;