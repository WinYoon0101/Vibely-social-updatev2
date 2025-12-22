'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { getAllQuizzes, createQuiz, updateQuiz, deleteQuiz, getQuizById } from '@/service/quiz.service';

const GlobalContext = createContext();

export function ContextProvider({ children }) {
    const [allQuizzes, setAllQuizzes] = useState([]);
    const [selectQuizToStart, setSelectQuizToStart] = useState(null);
    const [user, setUser] = useState({});
    const [openIconBox, setOpenIconBox] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState({ faIcon: faQuestion });

    const [dropDownToggle, setDropDownToggle] = useState(false);
    const [threeDotsPositions, setThreeDotsPositions] = useState({ x: 0, y: 0 });
    const [isLoading, setLoading] = useState(true);
    const [userXP, setUserXP] = useState(0);

    // Fetch tất cả quiz
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const quizzes = await getAllQuizzes();
                setAllQuizzes(quizzes || []);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    // Xử lý User (nếu có API riêng, bạn có thể thay thế bằng service)
    useEffect(() => {
        setUser({ name: 'quizUser', isLogged: false, experience: 0 });
    }, []);

    useEffect(() => {
        setUser((prevUser) => ({
            ...prevUser,
            experience: userXP,
        }));
    }, [userXP]);

    useEffect(() => {
        if (selectedQuiz) {
            setSelectedIcon({ faIcon: selectedQuiz.icon });
        } else {
            setSelectedIcon({ faIcon: faQuestion });
        }
    }, [selectedQuiz]);

    // CRUD Quiz Functions
    const addQuiz = async (quizData) => {
        try {
            const newQuiz = await createQuiz(quizData);
            setAllQuizzes((prev) => [...prev, newQuiz]);
            toast.success("Tạo quiz thành công!");
        } catch (error) {
            toast.error("Lỗi khi tạo quiz!");
        }
    };

    // Cập nhật quiz theo ID
    const updateQuizById = async (quizId, quizData) => {
        try {
            const updatedQuiz = await updateQuiz(quizId, quizData);
            setAllQuizzes((prev) =>
                prev.map((quiz) => (quiz.id === quizId ? updatedQuiz : quiz))
            );
            toast.success("Cập nhật quiz thành công!");
        } catch (error) {
            toast.error("Lỗi khi cập nhật quiz!");
        }
    };

    // Xóa quiz theo ID
    const removeQuiz = async (quizId) => {
        try {
            await deleteQuiz(quizId);
            setAllQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
            toast.success("Xóa quiz thành công!");
        } catch (error) {
            toast.error("Lỗi khi xóa quiz!");
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                allQuizzes,
                setAllQuizzes,
                quizToStartObject: { selectQuizToStart, setSelectQuizToStart },
                userObject: { user, setUser },
                openBoxToggle: { openIconBox, setOpenIconBox },
                selectedIconObject: { selectedIcon, setSelectedIcon },
                dropDownToggleObject: { dropDownToggle, setDropDownToggle },
                threeDotsPositionsObject: { threeDotsPositions, setThreeDotsPositions },
                selectedQuizObject: { selectedQuiz, setSelectedQuiz },
                userXpObject: { userXP, setUserXP },
                isLoadingObject: { isLoading, setLoading },
                addQuiz,
                updateQuizById,
                removeQuiz,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default function useGlobalContextProvider() {
    return useContext(GlobalContext);
}
