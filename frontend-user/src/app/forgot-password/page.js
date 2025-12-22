"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post(`${API_URL}/forgot-password/send-code`, { email });
            // Lưu email vào localStorage để sử dụng ở trang code-confirm
            localStorage.setItem('resetPasswordEmail', email);
            router.push("/forgot-password/code-confirm");
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FDFF] p-6">
            <form onSubmit={handleSubmit} className="w-[34%] bg-white shadow-md rounded-lg p-7 text-center border border-[#0E42D2]">
                <div className="mb-6 flex justify-center">
                    <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={80} height={30} />
                </div>
                <p className="text-sm mb-4" style={{ color: '#1CA2C1' }}>
                    Để tiếp tục quá trình thiết lập lại mật khẩu, vui lòng nhập email của bạn
                </p>
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <div className="flex flex-col items-center w-full text-sm">
                    <input
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-4 text-[#C6C6C8]"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-[40%] bg-[#23CAF1] text-sm text-white py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 mb-4 font-bold disabled:opacity-50"
                >
                    {loading ? 'Đang gửi...' : 'Tiếp tục'}
                </button>

                <div className="flex justify-end text-gray-500 text-sm">
                    <a className="hover:underline mr-2" style={{ color: '#B0C4DE' }}>
                        Quay trở lại
                    </a>
                    <a href="/user-login" className="font-bold" style={{ color: '#086280' }}>
                        Đăng nhập
                    </a>
                </div>
            </form>
        </div>
    );
}