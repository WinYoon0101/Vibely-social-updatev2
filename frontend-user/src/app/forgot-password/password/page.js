"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

    useEffect(() => {
        // Lấy email và code từ localStorage khi component mount
        const savedEmail = localStorage.getItem('resetPasswordEmail');
        const savedCode = localStorage.getItem('resetPasswordCode');
        if (!savedEmail || !savedCode) {
            router.push('/forgot-password');
        } else {
            setEmail(savedEmail);
            setCode(savedCode);
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await axios.post(`${API_URL}/forgot-password/reset-password`, {
                email,
                code,
                newPassword: password
            });
            // Xóa dữ liệu đã lưu
            localStorage.removeItem('resetPasswordEmail');
            localStorage.removeItem('resetPasswordCode');
            alert('Đặt lại mật khẩu thành công!');
            router.push("/user-login");
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FDFF] p-6">
            <form onSubmit={handleSubmit} className="w-[31%] bg-white shadow-md rounded-lg p-6 text-center border border-[#0E42D2]">
                <div className="mb-6 flex justify-center">
                    <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={80} height={30} />
                </div>
                <p className="text-sm text-center mb-4 text-[#1CA2C1]">
                    Cùng học tập và kết bạn ở khắp mọi nơi trên thế giới trên Vibely
                </p>
                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <div className="w-full">
                    <label className="block text-left text-sm font-bold text-[#086280] mb-1">Nhập mật khẩu mới</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-4"
                        required
                    />
                    <label className="block text-left text-sm font-bold text-[#086280] mb-1">Nhập lại mật khẩu mới</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-6"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#23CAF1] text-white text-sm py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 font-bold disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
            </form>
        </div>
    );
}