'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { updateQuiz } from '@/service/quiz.service';

function QuizStartQuestions({ quizData, onUpdateTime }) {
    const time = 30;
    const { quizQuestions } = quizData;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [isQuizEnded, setIsQuizEnded] = useState(false);
    const [score, setScore] = useState(0);
    const [currentQuiz, setCurrentQuiz] = useState(quizData);
    const [timer, setTimer] = useState(time);
    const intervalRef = React.useRef(null);
    const [isHandlingTimeout, setIsHandlingTimeout] = useState(false);

    // Effect cho timer updates
    useEffect(() => {
        onUpdateTime(timer);
    }, [timer, onUpdateTime]);

    // Effect cho interval
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setTimer(time);
        setIsHandlingTimeout(false);

        intervalRef.current = setInterval(() => {
            setTimer((currentTime) => {
                if (currentTime === 0) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return currentTime - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentQuestionIndex]);

    // Effect xử lý khi hết giờ
    useEffect(() => {
        const handleTimeOut = async () => {
            if (timer === 0 && !isQuizEnded && !isHandlingTimeout) {
                setIsHandlingTimeout(true);

                toast.error('Hết thời gian!');

                const updatedQuiz = { ...currentQuiz };
                const currentQuestion = updatedQuiz.quizQuestions[currentQuestionIndex];

                if (currentQuestion.answeredResult === -1) {
                    currentQuestion.statistics.totalAttempts += 1;
                    currentQuestion.statistics.incorrectAttempts += 1;
                    currentQuestion.answeredResult = -2;
                    setCurrentQuiz(updatedQuiz);
                }

                await new Promise(resolve => setTimeout(resolve, 2000));

                if (currentQuestionIndex === quizQuestions.length - 1) {
                    setIsQuizEnded(true);
                    clearInterval(intervalRef.current);
                } else {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setSelectedChoice(null);
                }
            }
        };

        handleTimeOut();
    }, [timer]);

    async function saveDataIntoDB() {
        try {
            const id = quizData._id;
            const res = await updateQuiz(id, {
                updateQuizQuestions: currentQuiz.quizQuestions,
            });

            if (!res) {
                toast.error('Có lỗi xảy ra khi lưu dữ liệu quiz');
                return;
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi lưu dữ liệu quiz');
        }
    }

    useEffect(() => {
        if (isQuizEnded) {
            // Lưu dữ liệu vào DB khi quiz kết thúc
            const updatedQuiz = { ...currentQuiz };
            updatedQuiz.quizQuestions.forEach((quizQuestion) => {
                quizQuestion.answeredResult = -1;
            });
            setCurrentQuiz(updatedQuiz);
            saveDataIntoDB();
        }
    }, [isQuizEnded]);


    // Function chọn đáp án
    function selectChoiceFunction(choiceIndexClicked) {
        if (timer === 0 || isHandlingTimeout) return;
        setSelectedChoice(choiceIndexClicked);
        const updatedQuiz = { ...currentQuiz };
        updatedQuiz.quizQuestions[currentQuestionIndex].answeredResult = choiceIndexClicked;
        setCurrentQuiz(updatedQuiz);
    }

    // Function chuyển sang câu hỏi tiếp theo
    function moveToTheNextQuestion() {
        if (timer === 0 || isHandlingTimeout) return;

        if (currentQuiz.quizQuestions[currentQuestionIndex].answeredResult === -1) {
            toast.error('Vui lòng chọn một đáp án!');
            return;
        }

        const updatedQuiz = { ...currentQuiz };
        updatedQuiz.quizQuestions[currentQuestionIndex].statistics.totalAttempts += 1;

        const isCorrect = updatedQuiz.quizQuestions[currentQuestionIndex].answeredResult ===
            updatedQuiz.quizQuestions[currentQuestionIndex].correctAnswer;

        if (!isCorrect) {
            updatedQuiz.quizQuestions[currentQuestionIndex].statistics.incorrectAttempts += 1;
            setCurrentQuiz(updatedQuiz);
            toast.error('Đáp án sai!');

            setTimeout(() => {
                if (currentQuestionIndex === quizQuestions.length - 1) {
                    setIsQuizEnded(true);
                    clearInterval(intervalRef.current);
                } else {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setSelectedChoice(null);
                }
            }, 1500);
            return;
        }

        updatedQuiz.quizQuestions[currentQuestionIndex].statistics.correctAttempts += 1;
        setCurrentQuiz(updatedQuiz);
        setScore(prev => prev + 1);
        toast.success('Đáp án đúng!');

        if (currentQuestionIndex === quizQuestions.length - 1) {
            setIsQuizEnded(true);
            clearInterval(intervalRef.current);
            return;
        }

        setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedChoice(null);
        }, 1500);
    }

    return (
        <div className="relative poppins rounded-sm m-9 w-9/12 mt-[20px] ">
            <Toaster
                toastOptions={{
                    className: '',
                    duration: 1500,
                    style: {
                        padding: '12px',
                    },
                }}
            />
            {/* The Question Part */}
            <div className="flex   items-center gap-2">
                <div className="bg-blue-700 flex  justify-center items-center rounded-md w-11 h-11 text-white p-3">
                    {currentQuestionIndex + 1}
                </div>
                <p>{quizQuestions[currentQuestionIndex].mainQuestion}</p>
            </div>
            {/* The Answers Part */}
            <div className="mt-7 flex flex-col gap-2">
                {quizQuestions[currentQuestionIndex].choices.map(
                    (choice, indexChoice) => (
                        <div
                            key={indexChoice}
                            onClick={() => {
                                selectChoiceFunction(indexChoice);
                            }}
                            className={`p-3 ml-11 w-10/12 border border-blue-700 rounded-md
               hover:bg-[#1E75F0] hover:text-white cursor-pointer transition-all select-none ${selectedChoice === indexChoice
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-white'
                                }`}
                        >
                            {choice}
                        </div>
                    ),
                )}
            </div>
            {/* Submit Button */}
            <div className="flex justify-end mt-7  ">
                <button
                    onClick={() => {
                        moveToTheNextQuestion();
                    }}
                    disabled={isQuizEnded ? true : false}
                    className={`p-2 px-5 text-[15px] text-white rounded-md bg-blue-700 mr-[70px] ${isQuizEnded ? 'opacity-60' : 'opacity-100'
                        }`}
                >
                    CHỌN
                </button>
            </div>
            {isQuizEnded && (
                <ScoreComponent
                    quizStartParentProps={{
                        setIsQuizEnded,
                        setCurrentQuestionIndex,
                        setSelectedChoice,
                        score,
                        setScore,
                        quizData,
                        currentQuiz
                    }}
                />
            )}
        </div>
    );
}

export default QuizStartQuestions;

// Component hiển thị điểm số và các thông tin khác sau khi quiz kết thúc
function ScoreComponent({ quizStartParentProps }) {
    const { quizData, currentQuiz } = quizStartParentProps;
    const numberOfQuestions = quizData.quizQuestions.length;
    const router = useRouter();

    const {
        setIsQuizEnded,
        setCurrentQuestionIndex,
        setSelectedChoice,
        setScore,
        score,
    } = quizStartParentProps;

    function emojiIconScore() {
        const emojiFaces = [
            'confused-emoji.png',
            'happy-emoji.png',
            'very-happy-emoji.png',
        ];
        const result = (score / quizData.quizQuestions.length) * 100;

        if (result < 25) {
            return emojiFaces[0];
        }

        if (result == 50) {
            return emojiFaces[1];
        }

        return emojiFaces[2];
    }

    function tryAgainFunction() {
        setIsQuizEnded(false);
        setCurrentQuestionIndex(0);
        setSelectedChoice(null);
        setScore(0);
    }

    return (
        <div className=" flex items-center justify-center rounded-md top-[-40px] border border-gray-200 absolute w-full h-[450px] bg-white">
            {/* Score */}
            <div className=" flex gap-4 items-center justify-center flex-col">
                <Image src={`/${emojiIconScore()}`} alt="" width={100} height={100} />
                <div className="flex gap-1 flex-col">
                    <span className="font-bold text-2xl">Điểm</span>
                    <div className="text-[22px] text-center">
                        {score}/{numberOfQuestions}
                    </div>
                </div>
                <button
                    onClick={() => tryAgainFunction()}
                    className="p-2 bg-blue-700 rounded-md text-white px-6"
                >
                    Thử lại
                </button>
                {/* statistics */}
                <div className="  w-full flex gap-2 flex-col mt-3">
                    <div className="flex gap-1 items-center justify-center">
                        <Image src="/correct-answer.png" alt="" width={20} height={20} />
                        <span className="text-[14px]">Trả lời đúng: {score}</span>
                    </div>
                    <div className="flex gap-1 items-center justify-center">
                        <Image src="/incorrect-answer.png" alt="" width={20} height={20} />
                        <span className="text-[14px]">
                            Trả lời sai:
                            {quizData.quizQuestions.length - score}
                        </span>
                    </div>
                </div>
                <span
                    onClick={() => {
                        router.push('/quiz');
                    }}
                    className="text-blue-700 select-none cursor-pointer text-sm mt-8 "
                >
                    Chọn Quiz khác
                </span>
            </div>
        </div>
    );
}
