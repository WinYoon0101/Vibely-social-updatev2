'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiEdit2, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import convertToFaIcons from './convertToFaIcons';

const QuizCard = ({ quiz, onDelete }) => {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);

    // Kiểm tra nếu quiz không tồn tại
    if (!quiz) {
        return null;
    }

    // Tính toán success rate với kiểm tra null/undefined
    const calculateSuccessRate = () => {
    let correctQuestions = 0;
    let totalAttempts = 0;

    const questions = quiz?.quizQuestions;
    if (Array.isArray(questions)) {
        questions.forEach((question) => {
            totalAttempts += question.statistics?.totalAttempts || 0;
            correctQuestions += question.statistics?.correctAttempts || 0;
        });
    }

    return totalAttempts > 0
        ? Math.ceil((correctQuestions / totalAttempts) * 100)
        : 0;
};

    // Xử lý click vào nút edit
    const handleEdit = (e) => {
        e.stopPropagation();
        router.push(`/admin/quiz/edit-quiz/${quiz?._id}`);
        setShowDropdown(false);
    };

    // Xử lý click vào nút delete
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc chắn muốn xóa Quiz này không?')) {
            onDelete(quiz?._id);
        }
        setShowDropdown(false);
    };

    const successRate = calculateSuccessRate();
    const totalQuestions = quiz?.quizQuestions?.length || 0;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fadeIn">
            {/* Quiz Thumbnail */}
            <div
                className="relative aspect-[4/3] bg-[#1E75F0] cursor-pointer"
                onClick={handleEdit}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Quiz Icon */}
                    <div className="w-16 h-16 flex items-center justify-center">
                        <FontAwesomeIcon
                            className="text-white text-5xl"
                            icon={convertToFaIcons(quiz?.icon)}
                        />
                    </div>
                </div>

                {/* Options Button */}
                <div className="absolute top-2 right-2">
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown(!showDropdown);
                            }}
                            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 cursor-pointer"
                        >
                            <FiMoreVertical
                                className="w-5 h-5 text-white cursor-pointer hover:text-black transition-colors duration-200"
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div
                                className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100"
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    onClick={handleEdit}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                    <span>Chỉnh sửa</span>
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 cursor-pointer"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    <span>Xóa</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quiz Info */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold line-clamp-2 min-h-[2.5rem] flex-1">
                        {quiz?.quizTitle}
                    </h3>
                    <p className="text-sm text-gray-500 whitespace-nowrap mt-1">
                        {totalQuestions} câu hỏi
                    </p>
                </div>
            </div>

            {/* Quiz Stats */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                    {/* Tỉ lệ đúng */}
                    <div className="flex-1 px-2 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-300">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-green-50 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Tỉ lệ đúng</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {successRate}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizCard