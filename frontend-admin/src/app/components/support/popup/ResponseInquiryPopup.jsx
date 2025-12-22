import { useState } from "react";
import { IoClose } from "react-icons/io5";

const ResponseInquiryPopup = ({ inquiry, onUpdate, onClose }) => {

    // State lưu dữ liệu nhập
    const [formData, setFormData] = useState({
        inquiryId: inquiry?._id || "",
        response: inquiry?.response || "",
    });

    const [error, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Xử lý khi thay đổi dữ liệu nhập
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError({ ...error, [e.target.name]: "" });
    };

    const validate = () => {
        let newError = {};
        if (!formData.response.trim()) newError.response = "Nội dung phản hồi không được để trống";
        
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    // Gửi dữ liệu cập nhật
    const handleSubmit = async () => {
        if(validate()){
            setIsSubmitting(true);
            await onUpdate(formData);
            setIsSubmitting(false);
        }
    };

    return (
    <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
        <div className="relative bg-white p-6 rounded-xl shadow-lg w-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-semibold">Phản hồi thắc mắc</h2>
                <button onClick={onClose} className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer">
                    <IoClose size={28} />
                </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-7">
                <div>
                    <label className="block mb-2 font-semibold">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={inquiry.userId.email}
                        className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none"
                        readOnly
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Nội dung thắc mắc</label>
                    <textarea
                        type="text"
                        name="message"
                        value={inquiry.message}
                        className="w-full border border-gray-400 p-2 rounded-lg focus:outline-none"
                        readOnly
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block mb-2 font-semibold">Nội dung phản hồi</label>
                    <textarea
                        type="text"
                        name="response"
                        value={formData.response}
                        onChange={handleChange}
                        className={`w-full border p-2 rounded-lg focus:outline-none
                            ${error.response ? "border-red-500" : "border-gray-400"}`}
                        placeholder="Nhập nội dung phản hồi"
                        rows={3}
                    />
                    {error.response && <p className="text-red-500 text-sm">{error.response}</p>}
                </div>
            </div>

            {/* Nút Gửi */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-10 py-[10px] text-white rounded-lg cursor-pointer text-[16px] transition-all duration-200
                        ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#086280] hover:bg-[#07556F]"}`}
                >
                    {isSubmitting ? "Đang gửi..." : "Gửi"}
                </button>
            </div>
        </div>
    </div>
    );
};

export default ResponseInquiryPopup;