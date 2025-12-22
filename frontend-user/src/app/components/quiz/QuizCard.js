'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import convertToFaIcons from './convertToFaIcons';
import Image from 'next/image';

function QuizCard({ singleQuiz }) {
    if (!singleQuiz) return <p>Không có dữ liệu quiz.</p>;

    // Tính toán success rate
    const calculateSuccessRate = () => {
        let correctQuestions = 0;
        let totalAttempts = 0;

        singleQuiz.quizQuestions?.forEach((question) => {
            totalAttempts += question.statistics?.totalAttempts || 0;
            correctQuestions += question.statistics?.correctAttempts || 0;
        });

        return totalAttempts > 0
            ? Math.ceil((correctQuestions / totalAttempts) * 100)
            : 0;
    };

    const { quizTitle, quizQuestions, icon } = singleQuiz;
    const totalQuestions = quizQuestions?.length || 0;
    const successRate = calculateSuccessRate();

    return (
        <div className="h-full flex flex-col justify-between border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm bg-blue-50">
            {/* Icon Section */}
            <div className="bg-[#1E75F0] w-full h-28 flex justify-center items-center rounded-md mb-4 relative">
                <FontAwesomeIcon
                    className="text-white text-5xl"
                    icon={convertToFaIcons(icon)}
                />
            </div>

            {/* Quiz Info */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">{quizTitle || "Không có tiêu đề"}</h3>
            <p className="text-gray-600 mb-3">{totalQuestions} Câu hỏi</p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                    <Image src="/images/target.png" width={20} height={10} alt="" className='mr-2' />
                    <span className="bg-blue-400 text-white px-2 py-1 rounded-full text-[12px] font-medium">
                        Tỉ lệ đúng: {successRate}%
                    </span>
                </div>

                <Link
                    href={`/quiz/${singleQuiz._id}`}
                    className="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-colors duration-300 flex items-center justify-center w-9 h-9"
                >
                    <FontAwesomeIcon
                        className="text-white"
                        width={15}
                        height={15}
                        icon={faPlay}
                    />
                </Link>

            </div>
        </div>
    );
}

export default QuizCard;