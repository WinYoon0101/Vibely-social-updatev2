'use client';

import React, { useEffect, useState } from 'react';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getQuizById } from '@/service/quiz.service';
import * as Icons from '@fortawesome/free-solid-svg-icons';

function QuizStartHeader({ quizId, parentTimer }) {
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuizById(quizId);
                setQuiz(data);
            } catch (error) {
                console.error("Lỗi khi tải quiz:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (quizId) fetchQuiz();
    }, [quizId]);

    if (isLoading || !quiz) return null;

    const { quizTitle, quizQuestions, icon } = quiz;

    // Hàm lấy icon từ tên
    const getIconFromName = (iconName) => {
        if (!iconName) return null;
        // Chuyển đổi tên icon từ database (ví dụ: 'faCode') thành key trong Icons (ví dụ: 'faCode')
        const iconKey = iconName;
        return Icons[iconKey];
    };

    const iconData = getIconFromName(icon);

    return (
        <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="max-w-[1200px] mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Quiz Title */}
                    <div className="flex gap-2 items-center">
                        <div className="bg-blue-600 w-12 h-12 flex items-center justify-center p-2 rounded-md">
                            {iconData ? (
                                <FontAwesomeIcon
                                    className="text-white"
                                    width={25}
                                    height={25}
                                    icon={iconData}
                                />
                            ) : (
                                <div className="text-white text-center">
                                    <span className="text-xs">{quizQuestions?.length || 0}</span>
                                    <br />
                                    <span className="text-xs">Câu</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                            <p className="font-bold text-xl">{quizTitle}</p>
                            <span className="font-light text-sm">
                                {quizQuestions?.length || 0} Câu hỏi
                            </span>
                        </div>
                    </div>

                    {/* Timer */}
                    <div className="flex gap-2 items-center">
                        <FontAwesomeIcon
                            className="text-blue-700"
                            width={20}
                            height={20}
                            icon={faStopwatch}
                        />
                        <span className="text-lg font-semibold">00:00:{parentTimer.toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizStartHeader;
