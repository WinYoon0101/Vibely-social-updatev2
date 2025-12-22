'use client'

import { getQuizById, updateQuiz } from '@/service/quizAdmin.service';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa';
import Sidebar from '../../../../components/sidebar/Sidebar';

const EditQuizPage = () => {
    const router = useRouter();
    const params = useParams();
    const quizId = params.id;

    // State để lưu thông tin quiz
    const [quiz, setQuiz] = useState({
        quizTitle: '',
        icon: '',
        quizQuestions: []
    });

    const [expandedQuestions, setExpandedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy thông tin quiz từ API khi component mount
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuizById(quizId);
                if (response && response.data) {
                    setQuiz({
                        quizTitle: response.data.quizTitle || '',
                        icon: response.data.icon || '',
                        quizQuestions: response.data.quizQuestions || []
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin quiz:', error);
                toast.error('Không thể lấy thông tin quiz');
                router.push('/admin/quiz');
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);


    // Hàm để mở/đóng câu hỏi
    const toggleQuestion = (index) => {
        setExpandedQuestions(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            } else {
                return [...prev, index];
            }
        });
    };

    // Hàm để lưu quiz
    const handleSave = async () => {
        try {
            if (!quiz.quizTitle || !quiz.icon) {
                toast.error('Vui lòng nhập đầy đủ thông tin quiz');
                return;
            }

            const isValidQuestions = quiz.quizQuestions.length > 0 && quiz.quizQuestions.every(q =>
                q.mainQuestion &&
                q.choices &&
                q.choices.every(choice => choice) &&
                q.correctAnswer >= 0 &&
                q.correctAnswer < 4
            );

            if (!isValidQuestions) {
                toast.error('Vui lòng nhập đầy đủ thông tin cho tất cả câu hỏi');
                return;
            }

            // Chuẩn bị dữ liệu để gửi đi
            const quizData = {
                quizTitle: quiz.quizTitle,
                icon: quiz.icon,
                quizQuestions: quiz.quizQuestions.map(q => ({
                    mainQuestion: q.mainQuestion,
                    choices: q.choices,
                    correctAnswer: parseInt(q.correctAnswer)
                }))
            };

            const response = await updateQuiz(quizId, quizData);

            if (response && response.status === 'success') {
                toast.success('Cập nhật quiz thành công!');
                router.push('/admin/quiz');
            } else {
                const errorMessage = response?.message || 'Không thể cập nhật quiz';
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'Không thể cập nhật quiz';
            toast.error(errorMessage);
        }
    };


    // Hàm để thêm câu hỏi mới
    const handleAddQuestion = () => {
        setQuiz({
            ...quiz,
            quizQuestions: [...quiz.quizQuestions, {
                mainQuestion: '',
                choices: ['', '', '', ''],
                correctAnswer: 0
            }]
        });
        setExpandedQuestions(prev => [...prev, quiz.quizQuestions.length]);
    };

    const handleDeleteQuestion = (indexToDelete) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
            setQuiz({
                ...quiz,
                quizQuestions: quiz.quizQuestions.filter((_, index) => index !== indexToDelete)
            });
            setExpandedQuestions(prev => prev.filter(index => index !== indexToDelete));
        }
    };


    // Hàm để cập nhật thông tin câu hỏi
    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...quiz.quizQuestions];
        if (field.startsWith('choice')) {
            const choiceIndex = parseInt(field.split('.')[1]);
            newQuestions[index].choices[choiceIndex] = value;
        } else if (field === 'correctAnswer') {
            newQuestions[index].correctAnswer = parseInt(value);
        } else {
            newQuestions[index][field] = value;
        }
        setQuiz({ ...quiz, quizQuestions: newQuestions });
    };

    const handleQuizChange = (field, value) => {
        setQuiz({ ...quiz, [field]: value });
    };

    if (loading) {
        return (
            <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
                <div className="w-1/5 flex-shrink-0">
                    <Sidebar />
                </div>
                <div className="w-4/5 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#40A0C8]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <div className="w-1/5 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="w-4/5 flex flex-col">
                <div className="px-6 ml-[-20px] mr-[20px]">
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn mt-8">
                            {/* Quiz Title Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                        1
                                    </div>
                                    <h2 className="text-lg font-bold">Tiêu đề Quiz:</h2>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập tiêu đề Quiz"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                    value={quiz.quizTitle}
                                    onChange={(e) => handleQuizChange('quizTitle', e.target.value)}
                                />
                            </div>

                            {/* Icon Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                        2
                                    </div>
                                    <h2 className="text-lg font-bold">Biểu tượng:</h2>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập tên biểu tượng (ví dụ: faBook, faStar, etc.)"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                    value={quiz.icon}
                                    onChange={(e) => handleQuizChange('icon', e.target.value)}
                                />
                            </div>

                            {/* Quiz Questions Section */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                            3
                                        </div>
                                        <h2 className="text-lg font-bold">Câu hỏi Quiz:</h2>
                                    </div>
                                    <button
                                        onClick={handleAddQuestion}
                                        className="flex items-center px-4 py-2 bg-[#086280] text-white rounded-lg hover:bg-[#32515a] transition-colors duration-200"
                                    >
                                        <FaPlus className="mr-2" />
                                        <span>Thêm câu hỏi</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {quiz.quizQuestions && quiz.quizQuestions.map((question, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Question Header */}
                                            <div
                                                className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => toggleQuestion(index)}
                                            >
                                                <div className="flex items-center flex-1">
                                                    <span className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                                        {index + 1}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="Nhập câu hỏi"
                                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                        value={question.mainQuestion}
                                                        onChange={(e) => handleQuestionChange(index, 'mainQuestion', e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div className="flex items-center ml-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteQuestion(index);
                                                        }}
                                                        className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                                    >
                                                        <FaTrash className='text-red-600 cursor-pointer' />
                                                    </button>
                                                    {expandedQuestions.includes(index) ? (
                                                        <FaChevronUp className="text-gray-500 ml-2" />
                                                    ) : (
                                                        <FaChevronDown className="text-gray-500 ml-2" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Question Content */}
                                            {expandedQuestions.includes(index) && (
                                                <div className="p-4 border-t border-gray-200">
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Các lựa chọn:
                                                        </label>
                                                        {question.choices && question.choices.map((choice, choiceIndex) => (
                                                            <div key={choiceIndex} className="mb-2">
                                                                <div className="flex items-center">
                                                                    <span className="w-8">{String.fromCharCode(65 + choiceIndex)}:</span>
                                                                    <input
                                                                        type="text"
                                                                        placeholder={`Nhập lựa chọn ${String.fromCharCode(65 + choiceIndex)}`}
                                                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                                        value={choice}
                                                                        onChange={(e) => handleQuestionChange(index, `choice.${choiceIndex}`, e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Đáp án đúng:
                                                        </label>
                                                        <select
                                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                            value={question.correctAnswer}
                                                            onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                                                        >
                                                            <option value="0">A</option>
                                                            <option value="1">B</option>
                                                            <option value="2">C</option>
                                                            <option value="3">D</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end mt-6 space-x-4 mb-6">
                            <button
                                onClick={() => router.push('/admin/quiz')}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-[#086280] text-white rounded-lg hover:bg-[#32515a] cursor-pointer transition-colors duration-200 flex items-center space-x-2"
                            >
                                <span>Lưu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditQuizPage 