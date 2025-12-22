const DeleteInquiryPopup = ({ onConfirm, onClose}) => {
    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-[430px]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-red-600">XÓA THẮC MẮC</h2>
                </div>
                <p className="mb-8">
                    Bạn có chắc chắn muốn xóa thắc mắc này không?
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

export default DeleteInquiryPopup;