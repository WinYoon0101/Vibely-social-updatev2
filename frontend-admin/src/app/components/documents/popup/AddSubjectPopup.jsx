import { useState } from "react";
import { IoClose } from 'react-icons/io5';

const AddSubjectPopup = ({ levels, addSubject, onClose }) => {
    const [subjectName, setSubjectName] = useState("");
    const [selectedLevelId, setSelectedLevelId] = useState("");
    const [errors, setErrors] = useState({ subjectName: "", level: "" });

    const handleChange = (field, value) => {
        if (field === "subjectName") setSubjectName(value);
        if (field === "level") setSelectedLevelId(value);

        setErrors((prev) => ({ ...prev, [field]: "" })); // Xóa lỗi của field đó
    };

    const validateInputs = () => {
        let newErrors = { subjectName: "", level: "" };
        if (!subjectName.trim()) newErrors.subjectName = "Tên môn học không được để trống";
        if (!selectedLevelId) newErrors.level = "Vui lòng chọn cấp học";
        setErrors(newErrors);
        return !newErrors.subjectName && !newErrors.level;
    };
    
    const handleSubmit = () => {
        if (validateInputs()) {
            addSubject({ subjectName, levelId: selectedLevelId });
            setSubjectName("");
            setSelectedLevelId("");
            setErrors({});
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-96">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[22px] font-semibold">Thêm môn học</h2>
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer"
                    >
                        <IoClose size={28}/>
                    </button>
                </div>

                <label className="block mb-2 font-semibold">Tên môn học</label>
                <input 
                    type="text"
                    value={subjectName}
                    onChange={(e) => handleChange("subjectName", e.target.value)}
                    className={`w-full border p-2 rounded-lg focus:outline-none 
                    ${errors.subjectName ? "border-red-500 mb-2" : "border-gray-400 mb-8"}`}
                    placeholder="Nhập tên môn học"
                />
                {errors.subjectName && <p className="text-red-500 text-sm mb-6">{errors.subjectName}</p>}

                <label className="block mb-2 font-semibold">Cấp học</label>
                <select 
                    value={selectedLevelId}
                    onChange={(e) => handleChange("level", e.target.value)}
                    className={`border px-2 py-[10px] w-full bg-white rounded-lg focus:outline-none ${
                        errors.level ? "border-red-500 mb-2" : "border-gray-400 mb-8"
                    }`}
                >
                    <option value="">- Chọn cấp học -</option>
                    {levels.map((level) => (
                        <option 
                            key={level._id} 
                            value={level._id}
                        >
                            {level.name}
                        </option>
                    ))}
                </select>
                {errors.level && <p className="text-red-500 text-sm mb-6">{errors.level}</p>}

                <div className="flex justify-center">
                    <button
                        className="px-5 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200"
                        onClick={() => handleSubmit()}
                    >
                        Thêm môn học
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddSubjectPopup;