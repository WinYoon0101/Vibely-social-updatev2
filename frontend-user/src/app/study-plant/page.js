'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Page = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
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

    const handleClick = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push('/user-login');
                return;
            }

            // Kiểm tra xem người dùng đã có cây chưa
            try {
                const response = await axios.get(`${API_URL}/learning-trees`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Nếu có cây thì chuyển đến trang goal-tree
                if (response.data) {
                    router.push('/study-plant/goal-tree');
                }
            } catch (error) {
                // Nếu lỗi 404 (chưa có cây) thì chuyển đến trang select-tree
                if (error.response?.status === 404) {
                    router.push('/study-plant/select-tree');
                } else {
                    // Nếu lỗi khác thì mới hiển thị thông báo
                    console.error('Error checking tree:', error);
                    toast.error("Có lỗi xảy ra khi kiểm tra cây");
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Có lỗi xảy ra");
        }
    };

    return (
        <div className="pt-20 min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9FDFF]" style={{
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(200, 230, 255, 0.5) 0%, rgba(200, 230, 255, 0.3) 90%)'
        }}>
            <div className="max-w-4xl w-full text-center font-[Inter]">
                {/* Logo and Title */}
                <div className="mb-12">
                    <img
                        src="/study-plant/tree-page-1.png"
                        alt="Vibely Plant"
                        className="w-24 h-28 mx-auto mb-4"
                    />
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3498DB] to-[#2ECC71] mb-4">
                        Cây học tập Vibely
                    </p>
                    <p className="text-xl text-[#34495E] max-w-2xl mx-auto">Nơi kiến thức đâm chồi, trí tuệ nở hoa</p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {[
                        {
                            image: '/study-plant/seed.png',
                            title: 'Gieo hạt kiến thức',
                            desc: 'Xây dựng nền tảng vững chắc từ những kiến thức cơ bản'
                        },
                        {
                            image: '/study-plant/process.png',
                            title: 'Chăm sóc mỗi ngày',
                            desc: 'Hệ thống theo dõi và nhắc nhở giúp bạn duy trì thói quen học tập'
                        },
                        {
                            image: '/study-plant/leaf.png',
                            title: 'Thu hoạch thành công',
                            desc: 'Ghi nhận sự tiến bộ và thành quả đạt được'
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="mb-4">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-10 h-10 mx-auto"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">{item.title}</h3>
                            <p className="text-[#7F8C8D]">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <button onClick={handleClick}
                    className="bg-gradient-to-r from-[#3498DB] to-[#2ECC71] text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 transform">
                    Bắt đầu hành trình <i className="fas fa-arrow-right ml-2" />
                </button>

                <p className="mt-8 text-[#7F8C8D] text-sm">
                    © 2025 Đây là tính năng mới và còn đang phát triển của Vibely
                </p>
            </div>
        </div>
    );
};

export default Page;
