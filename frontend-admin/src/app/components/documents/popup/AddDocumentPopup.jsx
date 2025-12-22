import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

const AddDocumentPopup = ({ levels, fetchSubjects, addDocument, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        levelId: "",
        subjectId: "",
        pages: "",
        format: "",
        url: "",
    });

    const [errors, setErrors] = useState({});
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Gọi API lấy subjects khi level thay đổi
    useEffect(() => {
        if (formData.levelId) {
            setLoadingSubjects(true);
            fetchSubjects(formData.levelId)
                .then((data) => {
                    setSubjects(data || []);
                    setFormData((prev) => ({ ...prev, subjectId: "" }));
                })
                .finally(() => setLoadingSubjects(false));
        } else {
            setSubjects([]);
        }
    }, [formData.levelId]);

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
        if (!formData.levelId) newErrors.levelId = "Vui lòng chọn cấp học";
        if (!formData.subjectId) newErrors.subjectId = "Vui lòng chọn môn học";
        if (!formData.pages || isNaN(formData.pages) || formData.pages <= 0)
            newErrors.pages = "Số trang phải là số dương";
        if (!formData.format.trim()) newErrors.format = "Định dạng không được để trống";
        if (!formData.url.trim()) newErrors.url = "URL không được để trống";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            addDocument(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-[600px]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[22px] font-semibold">Thêm tài liệu</h2>
                    <button onClick={onClose} className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer">
                        <IoClose size={28} />
                    </button>
                </div>

                {/* Form */}
                <div 
                    className={`grid grid-cols-2 gap-8`}
                >
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
                            name="levelId"
                            value={formData.levelId}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded-lg focus:outline-none bg-white
                                ${errors.levelId ? "border-red-500 mb-2" : "border-gray-400"}`}
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
                        {errors.levelId && <p className="text-red-500 text-sm">{errors.levelId}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Môn học</label>
                        <select
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange} 
                            className={`w-full border border-gray-400 p-2 rounded-lg focus:outline-none bg-white
                                ${errors.subjectId ? "border-red-500 mb-2" : "border-gray-400"}`}
                            disabled={!formData.levelId || loadingSubjects}
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
                        {errors.subjectId && <p className="text-red-500 text-sm">{errors.subjectId}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Số trang</label>
                        <input 
                            type="number"
                            name="pages"
                            value={formData.pages}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded-lg focus:outline-none
                                ${errors.pages ? "border-red-500 mb-2" : "border-gray-400"}`}
                            placeholder="Nhập số trang"
                        />
                        {errors.pages && <p className="text-red-500 text-sm">{errors.pages}</p>}
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Định dạng</label>
                        <input
                            type="text"
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded-lg focus:outline-none
                                ${errors.format ? "border-red-500 mb-2" : "border-gray-400"}`}
                            placeholder="Nhập định dạng tài liệu" 
                        />
                        {errors.format && <p className="text-red-500 text-sm">{errors.format}</p>}
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 font-semibold">URL của tài liệu</label>
                        <textarea
                            type="text"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className={`w-full border p-2 rounded-lg focus:outline-none
                                ${errors.url ? "border-red-500" : "border-gray-400"}`}
                            placeholder="Nhập URL của tài liệu"
                            rows={2}
                        />
                        {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
                    </div>
                </div>

                {/* Nút thêm tài liệu */}
                <div className="flex justify-center mt-6">
                    <button
                        className="px-5 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200"
                        onClick={handleSubmit}
                    >
                        Thêm tài liệu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddDocumentPopup;