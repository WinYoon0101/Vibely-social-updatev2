"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SearchBar = ({ onSearch, initialQuery = "", initialStatus = "" }) => {
    const [query, setQuery] = useState(initialQuery);
    const [status, setStatus] = useState(initialStatus);

    // Khi initialQuery thay đổi, cập nhật state
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    useEffect(() => {
        setStatus(initialStatus);
    }, [initialStatus]);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === "") {
            onSearch("", status);
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        onSearch(query, newStatus);
    };

    const handleSearch = () => {
        onSearch(query, status);
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
                <Button
                    className="w-24 h-10 cursor-pointer ml-2 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-gray-700 transition duration-200"
                    onClick={handleSearch}
                >
                    <Search size={20} />
                    <span className="text-[16px]">Tìm</span>
                </Button>
            </div>

            {/* Bộ lọc */}
            <div className="flex space-x-6">
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Lọc theo</label>
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        className="border py-2 px-4 w-full bg-white rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                        <option value="">Tất cả</option>
                        <option value="Chưa phản hồi">Chưa phản hồi</option>
                        <option value="Đã phản hồi">Đã phản hồi</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;