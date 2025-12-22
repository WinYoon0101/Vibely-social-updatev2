'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../../components/sidebar/Sidebar'
import { createQuiz } from '@/service/quizAdmin.service';
import toast from 'react-hot-toast';

const CreateQuizPage = () => {
    const router = useRouter();
    const [quizTitle, setQuizTitle] = useState('');
    const [icon, setIcon] = useState('');
    const [questions, setQuestions] = useState([{
        mainQuestion: '',
        choices: ['', '', '', ''],
        correctAnswer: 0
    }]);

    // Hàm xử lý lưu quiz
    const handleSave = async () => {
        try {
            // Kiểm tra dữ liệu
            if (!quizTitle || !icon) {
                toast.error('Vui lòng nhập đầy đủ thông tin quiz');
                return;
            }

            // Kiểm tra câu hỏi
            const isValidQuestions = questions.every(q =>
                q.mainQuestion &&
                q.choices.every(choice => choice) &&
                q.correctAnswer >= 0 &&
                q.correctAnswer < 4
            );

            if (!isValidQuestions) {
                toast.error('Vui lòng nhập đầy đủ thông tin cho tất cả câu hỏi');
                return;
            }

            // Tạo quiz mới
            const quizData = {
                quizTitle,
                icon,
                quizQuestions: questions
            };

            await createQuiz(quizData);
            toast.success('Tạo quiz thành công!');
            router.push('/admin/quiz');
        } catch (error) {
            console.error('Lỗi khi tạo quiz:', error);
            toast.error('Không thể tạo quiz. Vui lòng thử lại!');
        }
    };

    // Hàm thêm câu hỏi mới
    const handleAddQuestion = () => {
        setQuestions([...questions, {
            mainQuestion: '',
            choices: ['', '', '', ''],
            correctAnswer: 0
        }]);
    };


    // Hàm xử lý thay đổi câu hỏi
    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        if (field.startsWith('choice')) {
            const choiceIndex = parseInt(field.split('.')[1]);
            newQuestions[index].choices[choiceIndex] = value;
        } else if (field === 'correctAnswer') {
            newQuestions[index].correctAnswer = parseInt(value);
        } else {
            newQuestions[index][field] = value;
        }
        setQuestions(newQuestions);
    };

    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <div className="w-1/5 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="w-4/5 flex flex-col">
                {/* Content Area */}
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
                                    value={quizTitle}
                                    onChange={(e) => setQuizTitle(e.target.value)}
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
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                />
                            </div>

                            {/* Quiz Questions Section */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-8 h-8 bg-[#40A0C8] text-white rounded-full flex items-center justify-center mr-3">
                                        3
                                    </div>
                                    <h2 className="text-lg font-bold">Câu hỏi Quiz:</h2>
                                </div>

                                {questions.map((question, index) => (
                                    <div key={index} className="mb-8 p-6 border border-gray-200 rounded-lg">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Câu hỏi {index + 1}:
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập câu hỏi"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40A0C8]"
                                                value={question.mainQuestion}
                                                onChange={(e) => handleQuestionChange(index, 'mainQuestion', e.target.value)}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Các lựa chọn:
                                            </label>
                                            {question.choices.map((choice, choiceIndex) => (
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
                                ))}

                                <button
                                    onClick={handleAddQuestion}
                                    className="w-full py-3 bg-[#086280] text-white rounded-lg hover:bg-[#32515a] transition-colors duration-200 cursor-pointer"
                                >
                                    Thêm câu hỏi
                                </button>
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
                            <buttons
                                onClick={handleSave}
                                className="px-6 py-3 bg-[#086280] text-white rounded-lg hover:bg-[#32515a] cursor-pointer transition-colors duration-200 flex items-center space-x-2"
                            >
                                <span>Lưu</span>
                            </buttons>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateQuizPage