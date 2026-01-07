"use client";

import AchievementPopup from '@/app/components/plant-tree/AchievementPopup';
import NewPostForm from '@/app/posts/NewPostForm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import axios from 'axios';
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { FaQuestionCircle } from 'react-icons/fa';

const Cloud = ({ delay, position }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{
                opacity: [0.5, 1, 0.5],
                x: [0, 50, 0],
                y: [0, -20, 0]
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
            className={`absolute ${position}`}
        >
            <img src="/study-plant/cloud.png" alt="Cloud" className="w-32 h-20" />
        </motion.div>
    );
};

const Butterfly = ({ delay, position, image }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: position === 'left' ? -100 : 100 }}
            animate={{
                opacity: 1,
                x: position === 'left'
                    ? [0, 200, 0, -200, 0]
                    : [0, -200, 0, 200, 0],
                y: [0, -20, 0, 20, 0]
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
            className="absolute"
            style={{
                top: '30%',
                left: position === 'left' ? '20%' : '60%'
            }}
        >
            <img src={`/study-plant/${image}`} alt="Butterfly" className="w-20 h-20" />
        </motion.div>
    );
};

const LevelUpPopup = ({ isOpen, onClose, level }) => {
    if (!level) return null;

    const badgeImage = `/study-plant/badges/${level.name.toLowerCase()}.png`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold mb-4">🎉 Chúc mừng! 🎉</h2>
                            <p className="text-lg mb-4">
                                Bạn đã đạt được cấp độ mới:
                            </p>
                            <p className="text-xl font-bold mb-6 flex items-center justify-center gap-2">
                                {level.icon} {level.name}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                            className="mb-6"
                        >
                            <img
                                src={badgeImage}
                                alt={`${level.name} Badge`}
                                className="w-32 h-32 mx-auto"
                            />
                        </motion.div>

                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            onClick={onClose}
                            className="bg-gradient-to-r from-[#4ACFEF] to-[#476EFF] text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
                        >
                            Tiếp tục hành trình
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const GoalTreePage = () => {
    const router = useRouter();
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState("");
    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [showSeed, setShowSeed] = useState(true);
    const [showLevelUpPopup, setShowLevelUpPopup] = useState(false);
    const [previousLevel, setPreviousLevel] = useState(null);
    const [newAchievements, setNewAchievements] = useState([]);
    const [isAchievementPopupOpen, setIsAchievementPopupOpen] = useState(false);
    const [isPostFormOpen, setIsPostFormOpen] = useState(false);
    const [postImage, setPostImage] = useState(null);
    const [postDefaultContent, setPostDefaultContent] = useState('');
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    // Lấy token từ localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.error("Lỗi: Không tìm thấy token");
            router.push('/user-login');
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    useEffect(() => {
        if (tree && tree.growth_stage === 0) {
            // Hiển thị hạt giống trong 3 giây
            const timer = setTimeout(() => {
                setShowSeed(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [tree]);

    // Theo dõi thay đổi cấp độ
    useEffect(() => {
        if (tree && previousLevel !== null) {
            const currentLevel = getGrowthStageInfo(tree.growth_stage);
            const prevLevel = getGrowthStageInfo(previousLevel);

            if (currentLevel.name !== prevLevel.name) {
                setShowLevelUpPopup(true);
            }
        }
    }, [tree?.growth_stage]);

    // Cập nhật previous level khi lấy được dữ liệu cây
    useEffect(() => {
        if (tree) {
            setPreviousLevel(tree.growth_stage);
        }
    }, []);

    const fetchData = async () => {
        try {
            if (!token) {
                router.push('/user-login');
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Lấy thông tin cây
            const treeResponse = await axios.get(`${API_URL}/learning-trees`, config);
            if (!treeResponse.data.hasTree) {
                router.push('/study-plant/select-tree');
                return;
            }
            setTree(treeResponse.data.tree);


            // Lấy danh sách mục tiêu
            const goalsResponse = await axios.get(`${API_URL}/learning-goals`, config);
            setGoals(goalsResponse.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGoal = async () => {
        if (!newGoal.trim()) {
            toast.error("Vui lòng nhập mục tiêu");
            return;
        }

        try {
            if (!token) {
                router.push('/user-login');
                return;
            }
            const response = await axios.post(
                `${API_URL}/learning-goals`,
                { title: newGoal },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            setGoals([response.data, ...goals]);
            setNewGoal("");
        } catch (error) {
            console.error('Error adding goal:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                if (error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Có lỗi xảy ra khi thêm mục tiêu");
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error("Không thể kết nối đến server");
            } else {
                console.error('Error setting up request:', error.message);
                toast.error("Có lỗi xảy ra khi thêm mục tiêu");
            }
        }
    };

    const handleToggleGoal = async (id) => {
        try {
            if (!token) {
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                router.push('/user-login');
                return;
            }

            const response = await axios.patch(
                `${API_URL}/learning-goals/${id}/toggle`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
                const { goal, tree: updatedTree, newAchievements } = response.data;

                // Update goals list
                setGoals(goals.map(g => g._id === goal._id ? goal : g));

                // Cập nhật cây
                if (updatedTree) {
                    setTree(updatedTree);
                }

                // Hiển thị popup thành tích nếu có thành tích mới
                if (newAchievements && newAchievements.length > 0) {
                    setNewAchievements(newAchievements);
                    setIsAchievementPopupOpen(true);
                }
            }
        } catch (error) {
            console.error('Error toggling goal:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                if (error.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    router.push('/user-login');
                } else {
                    toast.error(error.response.data.message || "Có lỗi xảy ra khi cập nhật mục tiêu");
                }
            } else if (error.message === 'Network Error') {
                toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.");
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật mục tiêu");
            }
        }
    };

    const handleDeleteGoal = async (id) => {
        try {
            if (!token) {
                toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                router.push('/user-login');
                return;
            }

            const goal = goals.find(g => g._id === id);
            if (!goal) {
                toast.error("Không tìm thấy mục tiêu này");
                return;
            }

            if (!goal.is_completed) {

                const response = await axios.delete(`${API_URL}/learning-goals/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setGoals(goals.filter(goal => goal._id !== id));
                    toast.success("Đã xóa mục tiêu");
                }
            } else {
                // Nếu mục tiêu đã hoàn thành thì ẩn đi
                try {
                    const response = await axios.patch(
                        `${API_URL}/learning-goals/${id}/visibility`,
                        {},
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );

                    // Cập nhật state với goal đã được cập nhật
                    setGoals(goals.map(g => g._id === id ? response.data : g));
                } catch (error) {
                    console.error('Error toggling goal visibility:', error);
                    if (error.response) {
                        console.error('Error response:', error.response.data);
                    }
                    toast.error("Có lỗi xảy ra khi ẩn mục tiêu");
                }
            }
        } catch (error) {
            console.error('Lỗi xóa mục tiêu:', error);
            if (error.response) {
                console.error('Lỗi response:', error.response.data);
                if (error.response.status === 404) {
                    toast.error("Mục tiêu không tồn tại hoặc đã bị xóa");
                } else if (error.response.status === 403) {
                    toast.error("Bạn không có quyền xóa mục tiêu này");
                } else if (error.response.status === 401) {
                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    router.push('/user-login');
                } else {
                    toast.error(error.response.data.message || "Có lỗi xảy ra khi xóa mục tiêu");
                }
            } else if (error.message === 'Network Error') {
                toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.");
            } else {
                toast.error("Có lỗi xảy ra khi xóa mục tiêu");
            }
        }
    };

    // Lọc goals để chỉ hiển thị các mục tiêu visible
    const visibleGoals = goals.filter(goal => goal.is_visible);

    if (loading) {
        return <div>Loading...</div>;
    }

    const completed = goals.filter(goal => goal.is_completed).length;
    const stage = tree ? tree.growth_stage : 0;
    const LEVEL_THRESHOLDS = {
        0: 1,
        1: 5,
        2: 10,
        3: 20,
        4: 50,
        5: 100,
      };
    // Tính toán phần trăm tiến độ dựa trên số mục tiêu đã hoàn thành và cấp độ hiện tại
    const currentMax = LEVEL_THRESHOLDS[stage+1];
    const prevMax = stage === 0 ? 0 : LEVEL_THRESHOLDS[stage];
    const progress =
          (completed - prevMax) / (currentMax - prevMax);

    // Lấy tên và icon của cấp độ dựa trên cấp độ tăng trưởng
    const getGrowthStageInfo = (stage) => {
        switch (stage) {
            case 0: return { name: "Tân Binh", icon: "🌱" };
            case 1: return { name: "Tập Sự", icon: "📚" };
            case 2: return { name: "Chiến Binh", icon: "⚔️" };
            case 3: return { name: "Tinh Anh", icon: "💫" };
            case 4: return { name: "Cao Thủ", icon: "🔥" };
            case 5: return { name: "Thần Vương", icon: "👑" };
            default: return { name: "Tân Binh", icon: "🌱" };
        }
    };

    const handleShareAchievement = (image) => {
        setPostImage(image);
        setPostDefaultContent('Tôi vừa đạt được một thành tích mới! 🏆');
        setIsPostFormOpen(true);
    };

    return (
        <div className="min-h-screen pt-14">
            <LevelUpPopup
                isOpen={showLevelUpPopup}
                onClose={() => setShowLevelUpPopup(false)}
                level={tree ? getGrowthStageInfo(tree.growth_stage) : null}
            />
            <AchievementPopup
                isOpen={isAchievementPopupOpen}
                onClose={() => setIsAchievementPopupOpen(false)}
                achievements={newAchievements}
                onShare={handleShareAchievement}
            />
            <NewPostForm
                isPostFormOpen={isPostFormOpen}
                setIsPostFormOpen={setIsPostFormOpen}
                defaultImage={postImage}
                defaultContent={postDefaultContent}
                hideTrigger={true}
            />
            <div className="flex h-[673px]">
                {/* Left Panel */}
                <div className="w-[420px] bg-white shadow-lg p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <div className='flex gap-2 items-center justify-start'>
                            <p className="text-xl font-bold mb-4">Mục tiêu học tập</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FaQuestionCircle className='w-4 h-4 text-blue-500 hover:text-blue-700 mb-3'/>
                                </PopoverTrigger>
                                <PopoverContent className="bg-white border-blue-500 max-w-md">
                                <p className="text-gray-600 text-[14px]">
                                    Mẹo: Hoàn thành mục tiêu để cây của bạn phát triển! 🌿<br />
                                    - Tập Sự: 5 mục tiêu<br />
                                    - Chiến Binh: 10 mục tiêu<br />
                                    - Tinh Anh: 20 mục tiêu<br />
                                    - Cao Thủ: 50 mục tiêu<br />
                                    - Thần Vương: 100 mục tiêu
                                </p>
                                </PopoverContent>
                            </Popover>
                            </div>                            
                            <p className="text-gray-600 mb-6 text-[14px]">
                                Hoàn thành các mục tiêu bạn đề ra để tưới nước cho cây của bạn và ngắm nhìn nó lớn lên!
                                Mỗi mục tiêu hoàn thành sẽ giúp cây của bạn tiến gần hơn đến độ trưởng thành 🌱
                            </p>

                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[16px] font-medium">Mức độ tăng trưởng của cây</span>
                                <span className="text-[16px] font-medium">Cấp độ {tree?.growth_stage || 0}/5</span>
                            </div>
                            <div className="text-[14px] text-gray-600 mb-2 text-center">
                                <span>Cấp độ hiện tại: </span>
                                <span className="text-[15px] font-medium">
                                    {getGrowthStageInfo(tree?.growth_stage || 0).icon} {getGrowthStageInfo(tree?.growth_stage || 0).name}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
                                <div
                                    className="h-full bg-gradient-to-r from-[#4ACFEF] to-[#476EFF] rounded-full"
                                    style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
                                ></div>
                                <p className='text-xs text-center text-gray-500'>{completed - prevMax} / {currentMax - prevMax}</p>
                            </div>

                            <div className="flex space-x-4 mb-8">
                                <Input
                                    placeholder="Thêm mục tiêu học tập"
                                    className="flex-1"
                                    value={newGoal}
                                    onChange={(e) => setNewGoal(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                                />
                                <Button
                                    className="bg-gradient-to-b from-[#4ACFEF] to-[#476EFF] text-white"
                                    onClick={handleAddGoal}
                                >
                                    Thêm
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto">
                            {visibleGoals.map((goal) => (
                                <div key={goal._id} className="flex items-center text-[15px] justify-between p-2 bg-[#F8FDFF] border border-gray-300 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => handleToggleGoal(goal._id)}
                                            className={`w-6 h-6 rounded-full border-2 ${goal.is_completed ? 'border-green-500 bg-green-500' : 'border-gray-300'} relative flex items-center justify-center`}
                                        >
                                            {goal.is_completed && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <span className={goal.is_completed ? 'line-through text-gray-500' : ''}>
                                            {goal.title}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteGoal(goal._id)}
                                        className="text-gray-500 hover:text-red-500"
                                        title={goal.is_completed ? "Ẩn mục tiêu" : "Xóa mục tiêu"}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Hiển thị cây */}
                <div className="flex-1 relative overflow-visible">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('/study-plant/background-plant-tree.gif')" }}
                    />

                    {/* Mặt trời */}
                    <div className="absolute top-4 right-4">
                        <img src="/study-plant/sun.gif" alt="Sun" className="w-28 h-28" />
                    </div>

                    {/* Bình tưới */}
                    <div className="absolute bottom-24 left-8">
                        <img src="/study-plant/watering-can.png" alt="Watering Can" className="w-36 h-30" />
                    </div>

                    {/* Cây dựa trên loại và cấp độ tăng trưởng */}
                    <div className="absolute inset-x-0 bottom-[80px] flex justify-center items-end overflow-visible">
                        {tree && tree.growth_stage > 0 ? (
                            <div className="relative flex flex-col items-center overflow-visible">
                                <div className="relative w-[500px]">
                                    <img
                                        src={`/study-plant/green-tree/${tree.tree_type}-${tree.growth_stage}.png`}
                                        alt="Tree"
                                        className="w-full h-auto absolute bottom-[30px]"
                                        style={{ maxWidth: 'none' }}
                                    />
                                    <img
                                        src="/study-plant/tree-pot.png"
                                        alt="Tree Pot"
                                        className="w-40 h-36 absolute bottom-0 left-1/2 transform -translate-x-1/2"
                                    />
                                </div>
                            </div>
                        ) : (
                            <img
                                src="/study-plant/tree-pot.png"
                                alt="Tree Pot"
                                className="w-40 h-36"
                            />
                        )}
                    </div>

                    {/* Hiệu ứng rơi hạt giống - Chỉ hiển thị khi cây ở cấp độ 0 */}
                    <AnimatePresence>
                        {tree?.growth_stage === 0 && (
                            <motion.div
                                initial={{ y: -100 }}
                                animate={{
                                    y: 420,
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 1.2,
                                    ease: "easeIn"
                                }}
                                className="absolute top-0 left-[48%] transform -translate-x-1/2"
                            >
                                <img
                                    src="/study-plant/seeds.png"
                                    alt="Seed"
                                    className="w-10 h-10"
                                />
                                {/* Hiệu ứng sao sáng */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 1.2,
                                        repeat: 3,
                                        repeatDelay: 0.2
                                    }}
                                    className="absolute -top-2 -left-2"
                                >
                                    <img src="/study-plant/star1.png" alt="Star" className="w-8 h-8" />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 1.3,
                                        repeat: 3,
                                        repeatDelay: 0.2
                                    }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <img src="/study-plant/star2.png" alt="Star" className="w-8 h-8" />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 1.4,
                                        repeat: 3,
                                        repeatDelay: 0.2
                                    }}
                                    className="absolute -bottom-2 -left-2"
                                >
                                    <img src="/study-plant/star3.png" alt="Star" className="w-8 h-8" />
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 1.5,
                                        repeat: 3,
                                        repeatDelay: 0.2
                                    }}
                                    className="absolute -bottom-2 -right-2"
                                >
                                    <img src="/study-plant/star2.png" alt="Star" className="w-8 h-8" />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Các đám mây nổi */}
                    <Cloud delay={0} position="top-10 left-10" />
                    <Cloud delay={2} position="top-20 right-20" />
                    <Cloud delay={4} position="top-5 left-1/3" />
                    <Cloud delay={6} position="top-15 right-1/3" />

                    {/* Butterflies */}
                    <Butterfly delay={0} position="left" image="butterfly-1.gif" />
                    <Butterfly delay={2} position="right" image="butterfly-2.gif" />
                </div>
            </div>
        </div>
    );
};

export default GoalTreePage;
