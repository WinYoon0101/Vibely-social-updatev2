"use client"
import React, { useState } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import { updateAdminPassword } from '../../../service/authAdmin.service'
import { Button } from '@/components/ui/button'
import toast from "react-hot-toast"

const SettingsPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChangePassword = async () => {
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const response = await updateAdminPassword({ oldPassword, newPassword });


            if (response?.status === 'success') {
                setSuccess(response.message || "Đổi mật khẩu thành công!");
                toast.success(` ${response.message || "Đổi mật khẩu thành công!"}`);

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                console.log("⚠️ API trả về thất bại:", response);
                setError(response.message || "⚠️ Đổi mật khẩu thất bại!");
                toast.error(`⚠️ ${response.message || "Đổi mật khẩu thất bại!"}`);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra!';
            setError(errorMessage);
            toast.error(`${errorMessage}`);
        }
    };



    return (
        <div className="flex w-full flex-row min-h-screen bg-[#F4F7FE]">
            <Sidebar />
            <div className="w-full md:w-4/5 md:ml-52 px-6">
                {/* Header Row */}
                <div className="w-full py-6 mb-[-15px] flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-[#333]">Cài đặt</h1>
                    <div className="flex items-center space-x-4">
                    </div>
                </div>
                {/* Content Area */}
                <div className="w-full flex-grow mx-4 md:mx-6 lg:mx-14 p-6">
                    <div className="ml-[-20px] pr-4 mx-auto">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Password Form Header */}
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Đổi mật khẩu ADMIN</h2>
                            </div>

                            <div className="p-6 border-b border-gray-200 space-y-4">
                                {error && <p className="text-red-500">{error}</p>}
                                {success && <p className="text-green-500">{success}</p>}
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu cũ"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input"
                                        value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input"
                                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Xác nhận mật khẩu mới"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input"
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="p-6 flex justify-end">
                                <Button onClick={handleChangePassword} className="px-6 py-3 bg-[#086280] text-white font-medium rounded-lg hover:bg-[#274F5D] transition duration-200 cursor-pointer">
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;
