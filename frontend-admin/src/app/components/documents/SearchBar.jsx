"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SearchBar = ({
    onSearch,
    initialQuery = "",
    levels = [],
    subjects = [],
    selectedLevelId,
    setSelectedLevelId,
    selectedSubjectId,
    setSelectedSubjectId
}) => {
    const [query, setQuery] = useState(initialQuery);

    // Khi initialQuery thay đổi, cập nhật state
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            onSearch("");
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="flex flex-col space-y-4 mt-6">
            {/* Ô tìm kiếm */}
            <div className="flex items-center gap-x-2 md:gap-x-5 mb-6 ml-1">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Tìm kiếm..."
                    className="w-full md:w-1/2 border px-4 py-2 bg-white rounded-md focus:outline-none italic focus:ring-2 focus:ring-blue-400 border-gray-300"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button className="w-24 h-10 cursor-pointer ml-2 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-gray-700 transition duration-200"
                    onClick={handleSearch}>
                    <Search size={20} />
                    <span className="text-[16px]">Tìm</span>
                </Button>
            </div>

            {/* Bộ lọc */}
            <div className="flex space-x-6">
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Cấp học</label>
                    <select
                        className="border py-2 px-2 md:px-4 bg-white max-w-40 w-full md:max-w-60 truncate text-sm md:text-base rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        value={selectedLevelId || ""}
                        onChange={(e) => {
                            setSelectedLevelId(e.target.value || null);
                            setSelectedSubjectId(null);
                        }}
                    >
                        <option
                            key="all-levels"
                            value=""
                        >
                            - Chọn cấp học -
                        </option>
                        {levels.map((level) => (
                            <option
                                key={level._id}
                                value={level._id}
                            >
                                {level.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Môn học</label>
                    <select
                        className="border py-2 px-2 md:px-4 bg-white max-w-40 w-full md:max-w-60 truncate text-sm md:text-base rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                        value={selectedSubjectId || ""}
                        onChange={(e) => setSelectedSubjectId(e.target.value || null)}
                    >
                        <option
                            key="all-subjects"
                            value=""
                        >
                            - Chọn môn học -
                        </option>
                        {subjects.map((subject) => (
                            <option
                                key={subject._id}
                                value={subject._id}
                            >
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;