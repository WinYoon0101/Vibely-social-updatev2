'use client'

import { uploadProfilePicture } from '@/service/accountAdmin.service'
import Image from 'next/image'
import { useRef } from 'react'

const ProfilePictureSection = ({ userData, onPictureUpdate }) => {
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const res = await uploadProfilePicture(file);
        
        // Nếu response là object chứa data.profilePicture
        const imageUrl = res?.data?.profilePicture || res?.profilePicture;
        
        if (imageUrl) {
            onPictureUpdate(imageUrl);
        } else {
            alert("API không trả về URL ảnh hợp lệ!");
        }
    } catch (error) {
        alert("Có lỗi khi tải ảnh lên!");
    }
};




    return (
        <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center">
                <div className="w-40 max-w-full aspect-square  rounded-full overflow-hidden mb-6 relative group">
                    {userData.profilePicture ? (
                        <Image
                            src={userData.profilePicture}
                            alt="Profile picture"
                            width={160}
                            height={160}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-full text-gray-500">
                            Chưa có ảnh
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                    {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-500 mb-1">{userData.address} {userData.country}</p>
                <p className="text-gray-500 mb-6">GTM-7</p>

                <button
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200 cursor-pointer"
                    onClick={handleUploadClick}
                    type="button"
                >
                    Tải ảnh lên
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}

export default ProfilePictureSection
