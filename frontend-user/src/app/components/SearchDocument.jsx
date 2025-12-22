"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SearchDocument = ({ onSearch, initialQuery = "" }) => {
    const [query, setQuery] = useState(initialQuery);

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
        <div className="flex items-center gap-2 py-4">
            <Input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Nhập tên tài liệu..."
                className="w-5/6 h-10 bg-gray-500/20 rounded-full border-none placeholder-black pl-4 input-name-document"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
                variant="icon"
                className="flex items-center justify-center w-10 h-10 bg-[#086280] hover:bg-[#07556F] rounded-lg"
                onClick={handleSearch}
            >
                <Search className="text-white" size={24} />
            </Button>
        </div>
    );
};

export default SearchDocument;
