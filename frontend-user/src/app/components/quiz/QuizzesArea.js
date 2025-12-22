'use client';
import React, { useEffect, useState } from 'react';
import QuizCard from './QuizCard';
import { getAllQuizzes } from '@/service/quiz.service';
import { useRouter } from 'next/navigation';

function QuizzesArea() {
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const quizzes = await getAllQuizzes();
                setAllQuizzes(quizzes || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách quiz:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    return (
        <div className="poppins mx-12 pt-24">
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <p className="text-xl font-bold">Vibely Quizzes</p>
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {allQuizzes.length > 0 ? (
                            allQuizzes.map((singleQuiz, quizIndex) => (
                                <div key={quizIndex}>
                                    <QuizCard singleQuiz={singleQuiz} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Không có quiz nào.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizzesArea; 