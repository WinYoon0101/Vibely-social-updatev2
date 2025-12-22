'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getQuizById } from '@/service/quiz.service';
import QuizStartHeader from '@/app/components/quiz/QuizStartPage/QuizStartHeader';
import QuizStartQuestions from '@/app/components/quiz/QuizStartPage/QuizStartQuestion';

function QuizDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [parentTimer, setParentTimer] = useState(0);

    // Fetch quiz data
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuizById(id);
                if (!data) {
                    router.push('/');
                    return;
                }
                setQuiz(data);
            } catch (error) {
                console.error("Error loading quiz:", error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchQuiz();
    }, [id, router]);

    // Function to update time from child component
    function onUpdateTime(currentTime) {
        setParentTimer(currentTime);
    }

    if (isLoading) return <p>Loading...</p>;
    if (!quiz) return <p>Quiz not found.</p>;

    return (
        <div className="relative poppins flex flex-col px-2 lg:px-24 mt-[85px]">
            <QuizStartHeader quizId={id} parentTimer={parentTimer} />
            <div className="mt-10 flex items-center justify-center">
                <QuizStartQuestions
                    quizData={quiz}
                    onUpdateTime={onUpdateTime}
                />
            </div>
        </div>
    );
}

export default QuizDetailPage;
