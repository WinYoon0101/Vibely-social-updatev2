'use client'

import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

const DeleteInquiryPopup = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#086280]/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
                <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <FaExclamationTriangle className="text-red-500 text-xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h2>
                </div>

                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa người dùng <span className="font-semibold">{userName}</span>?
                    Hành động này không thể hoàn tác.
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Xác nhận xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteInquiryPopup 