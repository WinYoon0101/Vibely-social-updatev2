const DeleteDocumentPopup = ({ documentTitle, onConfirm, onClose}) => {
    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-[450px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-red-600">XÓA TÀI LIỆU</h2>
                </div>
                <p className="mb-6">
                    Bạn có chắc chắn muốn xóa <strong>{documentTitle}</strong> không?
                </p>
                <div className="flex justify-center gap-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-[10px] border border-gray-500 rounded-lg hover:bg-gray-200 cursor-pointer text-[16px] transition-all duration-200 w-[100px]"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-[10px] bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer text-[16px] transition-all duration-200 w-[100px]"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDocumentPopup;