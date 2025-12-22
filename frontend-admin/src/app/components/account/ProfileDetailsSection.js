'use client'

import React from 'react'

const ProfileDetailsSection = ({ userData, handleInputChange, handleSubmit }) => {
    return (
        <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Profile Form Header */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Thông tin tài khoản</h2>
                        <p className="text-gray-500">Thông tin có thể được chỉnh sửa</p>
                    </div>

                    {/* Profile Form */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    autoComplete="off"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={userData?.firstName || ""}
                                    onChange={handleInputChange}
                                    required
                                />

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    autoComplete="off"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={userData?.lastName || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={userData?.email || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    autoComplete="off"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Số điện thoại"
                                    value={userData?.phone || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quốc tịch
                                </label>
                                <select
                                    name="nationality"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    value={userData?.nationality || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Chọn quốc tịch</option>
                                    <option value="Việt Nam">Việt Nam</option>
                                    <option value="Nhật Bản">Nhật Bản</option>
                                    <option value="Mỹ">Mỹ</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thành phố
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    autoComplete="off"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Thành phố"
                                    value={userData?.city || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="p-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#086280] text-white font-medium rounded-lg cursor-pointer hover:bg-[#0a6b8c] transition duration-200 ease-in-out"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ProfileDetailsSection
