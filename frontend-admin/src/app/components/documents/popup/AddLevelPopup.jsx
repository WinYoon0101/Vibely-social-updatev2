import { useState } from "react";
import { IoClose } from 'react-icons/io5';

const AddLevelPopup = ({ addLevel, onClose }) => {
    const [levelName, setLevelName] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setLevelName(e.target.value);
        if (error) setError("");
    };

    const handleSubmit = () => {
        if (!levelName.trim()) {
            setError("Tên cấp học không được để trống");
            return;
        }

        addLevel(levelName);
        setLevelName("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#086280]/50 flex justify-center items-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg w-96">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-[22px] font-semibold">Thêm cấp học</h2>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 hover:text-gray-700 cursor-pointer"
                    >
                        <IoClose size={28}/>
                    </button>
                </div>

                {/* Nhập tên cấp học */}
                <label className="block mb-2 font-semibold">Tên cấp học</label>
                <input 
                    type="text"
                    value={levelName}
                    onChange={handleChange}
                    className={`w-full border p-2 rounded-lg focus:outline-none ${
                        error ? "border-red-500 mb-2" : "border-gray-400 mb-8"
                    }`}
                    placeholder="Nhập tên cấp học" 
                />
                {error && <p className="text-red-500 text-sm mb-6">{error}</p>}
                
                {/* Nút thêm cấp học */}
                <div className="flex justify-center">
                    <button
                        className="px-5 py-[10px] bg-[#086280] text-white rounded-lg hover:bg-[#07556F] cursor-pointer text-[16px] transition-all duration-200"
                        onClick={handleSubmit}
                    >
                        Thêm cấp học
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddLevelPopup;