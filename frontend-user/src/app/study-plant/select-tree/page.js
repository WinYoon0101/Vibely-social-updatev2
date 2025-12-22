'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Page = () => {
    const router = useRouter();
    const [selectedTree, setSelectedTree] = useState(null);
    const [token, setToken] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    // Lấy token từ localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            checkExistingTree(storedToken);
        } else {
            console.error("Lỗi: Không tìm thấy token");
            router.push('/user-login');
        }
    }, []);

    const checkExistingTree = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/learning-trees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data) {
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Error checking tree:', error);
        }
    };

    const handleSelectTree = async (treeType) => {
        try {
            if (!token) {
                console.log('No token found, redirecting to login');
                router.push('/user-login');
                return;
            }

            // Lưu loại cây vào CSDL
            await axios.post(`${API_URL}/learning-trees`, {
                tree_type: treeType
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Chuyển đến trang goal-tree
            router.push('/study-plant/goal-tree');
        } catch (error) {
            console.error('Error creating tree:', error);
            // Có thể thêm thông báo lỗi ở đây
        }
    };

    return (
        <div className="pt-20 min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9FDFF]" style={{
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(200, 230, 255, 0.5) 0%, rgba(200, 230, 255, 0.3) 90%)'
        }}>
            {/* Popup thông báo */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <p className="text-2xl font-bold text-center mb-4">Thông báo</p>
                        <p className="text-center mb-6">Bạn đã có cây học tập, vui lòng chuyển sang trang trồng cây!</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => router.push('/study-plant/goal-tree')}
                                className="bg-gradient-to-r from-[#3498DB] to-[#2ECC71] text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform"
                            >
                                Đến trang trồng cây
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl w-full text-center font-[Inter]">
                {/* Logo and Title */}
                <div className="mb-9">
                    <img
                        src="/study-plant/tree-page-1.png"
                        alt="Vibely Plant"
                        className="w-24 h-28 mx-auto mb-4"
                    />
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#2ECC71] mb-4">
                        Chọn loại cây trồng
                    </p>
                    <p className="text-xl text-[#34495E] max-w-2xl mx-auto">Hãy chọn loại cây trồng bạn thích để bắt đầu chăm sóc nó bằng thành quả học tập của mình nhé!</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div
                        onClick={() => handleSelectTree('cactus')}
                        className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${selectedTree === 'cactus' ? 'ring-2 ring-[#3498DB]' : ''}`}
                    >
                        <div className="mb-4">
                            <img
                                src="/study-plant/xuongrong-chonloaicay.png"
                                alt="Cây xương rồng"
                                className="w-27 h-18 mx-auto"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Cây xương rồng</h3>
                    </div>

                    <div
                        onClick={() => handleSelectTree('green_tree')}
                        className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${selectedTree === 'green_tree' ? 'ring-2 ring-[#3498DB]' : ''}`}
                    >
                        <div className="mb-4">
                            <img
                                src="/study-plant/cayxanh-chonloaicay.png"
                                alt="Cây xanh"
                                className="w-100 h-30 mx-auto"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Cây xanh</h3>
                    </div>

                    <div
                        onClick={() => handleSelectTree('sunflower')}
                        className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${selectedTree === 'sunflower' ? 'ring-2 ring-[#3498DB]' : ''}`}
                    >
                        <div className="mb-4">
                            <img
                                src="/study-plant/hoahuongduong-chonloaicay.png"
                                alt="Hoa hướng dương"
                                className="w-56 h-30 mx-auto"
                            />
                        </div>
                        <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">Hoa hướng dương</h3>
                    </div>
                </div>

                <p className="mt-8 text-[#7F8C8D] text-sm">
                    © 2025 Đây là tính năng mới và còn đang phát triển của Vibely
                </p>
            </div>
        </div>
    );
};

export default Page;
