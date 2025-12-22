"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LeftSideBar from "../components/LeftSideBar";

export default function ResetPassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Mật khẩu nhập lại không khớp!");
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            const response = await fetch(`${API_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setSuccess(true);
            setError('');
            setTimeout(() => {
                router.push("/user-login");
            }, 3000);
        } catch (error) {
            setError("Đã xảy ra lỗi khi đổi mật khẩu");
            console.error("Lỗi:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FDFF] p-6">
            <div className="md:hidden">
            <LeftSideBar/>
            </div>
            <form onSubmit={handleSubmit} className="w-full md:w-[50%] lg:w-[31%] bg-white shadow-md rounded-lg p-6 text-center border border-[#0E42D2] mt-14">
                <div className="mb-6 flex justify-center">
                    <Image src="/images/vibely_full_logo.png" alt="Vibely Logo" width={80} height={30} />
                </div>
                <p className="text-sm text-center mb-4 text-[#1CA2C1]">
                    Cùng học tập và kết bạn ở khắp mọi nơi trên thế giới trên Vibely
                </p>
                <div className="w-full">
                    <label className="block text-left text-sm font-bold text-[#086280] mb-1">Nhập mật khẩu cũ</label>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-[#0E42D2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E42D2] mb-4"
                        required
                    />
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
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {success && (
                        <p className="text-green-500 mb-4">
                            Đã đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#23CAF1] text-white text-sm py-3 rounded-lg hover:bg-[#1AA3C8] transition duration-200 font-bold"
                >
                    Đặt lại mật khẩu
                </button>
            </form>
        </div>
    );
}