"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function CodeConfirm() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    useEffect(() => {
        // Lấy email từ localStorage khi component mount
        const savedEmail = localStorage.getItem('resetPasswordEmail');
        if (!savedEmail) {
            router.push('/forgot-password');
        } else {
            setEmail(savedEmail);
        }
    }, [router]);

    const handleResendCode = async () => {
        setLoading(true);
        setError("");
        try {
            await axios.post(`${API_URL}/forgot-password/send-code`, { email });
            alert('Đã gửi lại mã xác thực');
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await axios.post(`${API_URL}/forgot-password/verify-code`, {
                email,
                code
            });
            // Lưu mã code vào localStorage
            localStorage.setItem('resetPasswordCode', code);
            router.push("/forgot-password/password");
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FDFF] p-6">
            <form onSubmit={handleSubmit} className="w-[34%] bg-white shadow-md rounded-lg p-8 text-center border border-[#0E42D2]">
                <div className="mb-6 flex justify-center">
                    <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={80} height={30} />
                </div>
                <p className="text-sm mb-4 text-left text-[#C6C6C8]">
                    <strong>Vui lòng kiểm tra email và nhập mã xác nhận để hoàn thành quá
                        trình thiết lập lại mật khẩu</strong>
                </p>
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <div className="flex flex-col items-center w-full">
                    <input
                        type="text"
                        placeholder="Nhập mã xác nhận"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] text-[#C6C6C8] mb-4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-[40%] bg-[#23CAF1] text-sm text-white py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 mb-4 font-bold disabled:opacity-50"
                >
                    {loading ? 'Đang xác thực...' : 'Tiếp tục'}
                </button>

                <div className="flex justify-end text-gray-500 text-sm mb-4">
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading}
                        className="mr-2 text-[#B0C4DE] hover:underline"
                    >
                        Chưa nhận được mã?
                    </button>
                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading}
                        className="font-bold text-[#086280]"
                    >
                        Gửi lại
                    </button>
                </div>

                <div className="flex justify-end text-gray-500 text-sm">
                    <a href="/forgot-password" className="hover:underline mr-2" style={{ color: '#B0C4DE' }}>
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