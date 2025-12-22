'use client';
import React, { useEffect, useState } from 'react';
import QuizCard from '../components/quiz/QuizCard';
import { getAllQuizzes } from '@/service/quiz.service';
import { useRouter } from 'next/navigation';
import LeftSideBar from '../components/LeftSideBar';

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
    <div className="poppins mx-12 pt-20">
      <div className="md:hidden">
      <LeftSideBar/>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p className="text-xl font-bold">Vibely Quizzes</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
