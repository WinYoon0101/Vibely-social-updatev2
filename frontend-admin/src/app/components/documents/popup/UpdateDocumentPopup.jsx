import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const UpdateDocumentPopup = ({ levels, fetchSubjects, document, updateDocument, onClose}) => {

    // State để lưu dữ liệu chỉnh sửa
    const [formData, setFormData] = useState({
        _id: document?._id || "",
        title: document?.title || "",
        level: document?.level._id || "",
        subject: document?.subject._id || "",
        pages: document?.pages || "",
        fileType: document?.fileType || "",
        fileUrl: document?.fileUrl || "",
    });

    const [errors, setErrors] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Gọi API lấy subjects khi level thay đổi
    useEffect(() => {
        if (formData.level) {
            setLoadingSubjects(true);
            fetchSubjects(formData.level)
                .then((data) => {
                    setSubjects(data || []);
    
                    // Chỉ reset subject nếu user chọn cấp học mới, không reset khi load lần đầu
                    setFormData((prev) => ({
                        ...prev,
                        subject: prev.subject && data.some(s => s._id === prev.subject) ? prev.subject : ""
                    }));
                })
                .finally(() => setLoadingSubjects(false));
        } else {
            setSubjects([]);
        }
    }, [formData.level]);

    // Xử lý khi thay đổi dữ liệu nhập
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "pages" ? Number(value) : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Tiêu đề không được để trống";
        if (!formData.level) newErrors.level = "Vui lòng chọn cấp học";
        if (!formData.subject) newErrors.subject = "Vui lòng chọn môn học";
        if (!formData.pages || isNaN(formData.pages) || formData.pages <= 0)
            newErrors.pages = "Số trang phải là số dương";
        if (!formData.fileType.trim()) newErrors.fileType = "Định dạng không được để trống";
        if (!formData.fileUrl.trim()) newErrors.fileUrl = "URL không được để trống";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            updateDocument(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-[600px]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[22px] font-semibold">Chỉnh sửa tài liệu</h2>
                    <button onClick={onClose} className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer">
                        <IoClose size={28} />
                    </button>
                </div>

                {/* Form */}
                <div className={`grid grid-cols-2 gap-8`}>
                    <div className="col-span-2">
                        <label className="block mb-2 font-semibold">Tiêu đề</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded-lg focus:outline-none
                                ${errors.title ? "border-red-500 mb-2" : "border-gray-400"}`}
                            placeholder="Nhập tiêu đề tài liệu"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Cấp học</label>
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded-lg focus:outline-none bg-white
                                ${errors.level ? "border-red-500 mb-2" : "border-gray-400"}`}
                        >
                            <option value="">Chọn cấp học</option>
                            {levels.map((level) => (
                                <option 
                                    key={level._id} 
                                    value={level._id}
                                >
                                    {level.name}
                                </option>
                            ))}
                        </select>
                        {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Môn học</label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full border border-gray-400 p-2 rounded-lg focus:outline-none bg-white
                                ${errors.subject ? "border-red-500 mb-2" : "border-gray-400"}`}
                            disabled={!formData.level || loadingSubjects}
                        >
                            <option value="">Chọn môn học</option>
                            {subjects.map((subject) => (
                                <option 
                                    key={subject._id}
                                    value={subject._id}
                                >
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                        {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Số trang</label>
                        <input
                            type="number"
                            name="pages"
                            value={formData.pages}
                            onChange={handleChange}
                            className={`w-full border border-gray-400 p-2 rounded-lg focus:outline-none
                                ${errors.pages ? "border-red-500 mb-2" : "border-gray-400"}`}
                            placeholder="Nhập số trang"
                        />
                        {errors.pages && <p className="text-red-500 text-sm">{errors.pages}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Định dạng</label>
                        <input
                            type="text"
                            name="fileType"
                            value={formData.fileType}
                            onChange={handleChange}
                            className={`w-full border border-gray-400 p-2 rounded-lg focus:outline-none
                                ${errors.fileType ? "border-red-500 mb-2" : "border-gray-400"}`}
                            placeholder="Nhập định dạng tài liệu"
                        />
                        {errors.fileType && <p className="text-red-500 text-sm">{errors.fileType}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 font-semibold">URL của tài liệu</label>
                        <textarea
                            type="text"
                            name="fileUrl"
                            value={formData.fileUrl}
                            onChange={handleChange}
                            className={`w-full border border-gray-400 p-2 rounded-lg focus:outline-none
                                ${errors.fileUrl ? "border-red-500 mb-2" : "border-gray-400"}`}
                            placeholder="Nhập URL của tài liệu"
                            rows={2}
                        />
                        {errors.fileUrl && <p className="text-red-500 text-sm">{errors.fileUrl}</p>}
                    </div>
                </div>

                {/* Nút Lưu thay đổi */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateDocumentPopup;