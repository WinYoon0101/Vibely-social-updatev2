'use client';

import Sidebar from '@/app/components/sidebar/Sidebar';
import { Button } from "@/components/ui/button";
import { deleteQuiz, getQuizzes } from '@/service/quizAdmin.service';
import { Search } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import QuizCard from './quiz-card/page';

const QuizPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch quizzes
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await getQuizzes();
                setQuizzes(response.data);
                setFilteredQuizzes(response.data);
            } catch (error) {
                toast.error('Không thể tải danh sách quiz');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleCreateQuiz = () => {
        router.push('/admin/quiz/add-quiz');
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredQuizzes(quizzes);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = quizzes.filter(q =>
                q.quizTitle.toLowerCase().includes(lowerQuery)
            );
            setFilteredQuizzes(filtered);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            await deleteQuiz(quizId);
            setQuizzes(quizzes.filter(q => q._id !== quizId));
            setFilteredQuizzes(filteredQuizzes.filter(q => q._id !== quizId));
            toast.success('Xóa quiz thành công');
        } catch (error) {
            console.error('Error deleting quiz:', error);
            toast.error('Không thể xóa quiz');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
                <Sidebar />
                <div className="w-full md:w-4/5 md:ml-52 py-6 px-6 overflow-y-auto">
                    <div className="flex items-center justify-center h-full">
                        <div className="w-16 h-16 border-4 border-[#23CAF1] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full min-h-screen bg-[#F4F7FE]">
            {/* Sidebar */}
            <Sidebar />

            {/* Nội dung chính */}
            <div className="w-full md:ml-52 py-6 px-6 overflow-y-auto">
                <h1 className="text-2xl font-semibold text-[#333] mb-4">Quản lý quiz</h1>

                {/* Tìm kiếm */}
                <div className="flex items-center gap-x-2 md:gap-x-5 mb-6 ml-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm..."
                        className="w-full md:w-3/4 border px-4 py-2 bg-white rounded-md focus:outline-none italic focus:ring-2 focus:ring-blue-400 border-gray-300"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                    />
                    <Button
                        className="w-24 h-10 cursor-pointer ml-2 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-gray-700 transition duration-200"
                        onClick={() => handleSearch(searchQuery)}
                    >
                        <Search size={20} />
                        <span className="text-[16px]">Tìm</span>
                    </Button>
                    {/* Nút tạo quiz */}
                    <Button
                        onClick={handleCreateQuiz}
                        className="w-30 h-10 cursor-pointer ml-50 px-6 py-2 bg-[#086280] text-white rounded-lg hover:bg-gray-700 transition duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[16px]">Tạo Quiz</span>
                    </Button>
                </div>

                {/* Quiz List Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Danh sách Quiz đã tạo</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredQuizzes.map((quiz) => (
                            <QuizCard
                                key={quiz._id}
                                quiz={quiz}
                                onDelete={() => handleDeleteQuiz(quiz._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
