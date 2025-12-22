import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import userStore from '@/store/userStore'

const ShowStoryPreview = ({ file, fileType, onClose, onPost, isNewStory, userStory, avatar, isLoading, onReact, reaction, reactions, onDelete }) => {
    const userPlaceholder = userStory?.username?.split(" ").map((name) => name[0]).join(""); //tên người dùng viết tắt
    //xóa tin (dành cho người đăng tin)
    const handleDeleteStory = () => {
        onDelete();
        onClose();
    }
    const { user } = userStore()
    return (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50'>
            <div className='relative w-full max-w-md h-[70vh] flex flex-col bg-white rounded-lg overflow-hidden'>
                {/*Nút đóng*/}
                <Button className='absolute top-4 right-4 z-10 text-gray-600 hover:bg-gray-200'
                    variant='ghost'
                    onClick={onClose}
                >
                    <X className='h-6 w-6' />
                </Button>
                {/*Avt+username người đăng*/}
                <div className='absolute top-4 left-4 z-10 flex items-center'>
                    <Avatar className='w-10 h-10 mr-2'>
                        {avatar ? (
                            <AvatarImage src={avatar} alt={userStory?.username} />
                        ) : (
                            <AvatarFallback>{userPlaceholder}</AvatarFallback>
                        )}
                    </Avatar>
                    <span className='text-gray-700 font-semibold'>{userStory?.username}</span>
                </div>
                {/*file phuong tien*/}
                <div className='flex flex-grow items-center justify-center bg-gray-100'>
                    {fileType === 'image' ? (
                        <img
                            src={file}
                            alt='story_preview'
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <video
                            src={file}
                            controls
                            autoPlay
                            alt='story_preview'
                            className="max-w-full max-h-full object-contain"
                        />
                    )}
                </div>
                {/*Nút đăng*/}
                {isNewStory && (
                    <div className='absolute bottom-4 right-2 transform -translate-x-1/2'>
                        <Button className='bg-[#086280] hover:bg-[#23CAF1] text-white'
                            onClick={onPost}
                        >
                            {isLoading ? "Đang lưu..." : "Đăng"}
                        </Button>
                    </div>
                )}
                {/*tym*/}
                {!isNewStory && (
                    <div>
                        {/*Chỉ người đăng tin mới xem được số lượt tim và có thể xóa story*/}
                        {user._id === userStory._id && (
                            <div>
                                <div className='absolute bottom-20 left-5 transform flex gap-5'>
                                    <Image src={"/love.png"} alt="loved" width={24} height={24} />
                                    <p className='text-lg font-semibold'>{reactions?.length}</p>
                                </div>
                                <Button
                                    className="absolute bottom-6 left-5 transform py-3 bg-red-300 opacity-70 hover:bg-red-400"
                                    onClick={() => handleDeleteStory()}
                                >
                                    Xóa story
                                </Button>

                            </div>
                        )}

                        <motion.div className='absolute bottom-4 right-2 transform' whileTap={!reaction ? { scale: 5 } : {}}>
                            <Button className='py-6'
                                variant="ghost"
                                onClick={() => onReact('tym')}
                            >
                                {reaction ?
                                    <div className='flex gap-2'>
                                        <Image src={"/love.png"} alt="loved" width={36} height={36} />
                                    </div>
                                    :
                                    <motion.div className='flex gap-2 text-black'>
                                        <Heart style={{ width: "30px", height: "30px" }} />
                                    </motion.div>
                                }
                            </Button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ShowStoryPreview