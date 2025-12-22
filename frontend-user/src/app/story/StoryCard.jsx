"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import userStore from '@/store/userStore'
import { usePostStore } from '@/store/usePostStore'
import ShowStoryPreview from './ShowStoryPreview'

const StoryCard = ({ isAddStory, story, onReact, onDelete }) => {
  const [filePreview, setFilePreview] = useState(null)
  const { handleCreateStory } = usePostStore()
  const { user } = userStore() //lấy thông tin người dùng
  const storyUserPlaceholder = story?.user?.username?.split(" ").map((name) => name[0]).join(""); //tên người đăng bài viết tắt
  const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join(""); //tên người dùng viết tắt
  const [isNewStory, setIsNewStory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  //chọn ảnh từ thiết bị
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  //Hàm chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      setFileType(file.type.startsWith("video") ? "video" : "image")
      setFilePreview(URL.createObjectURL(file))
      setIsNewStory(true)
      setShowPreview(true)
    }
    event.target.value = ''
  }
  //Hàm tạo story
  const handleCreateStoryPost = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      if (selectedFile) {
        formData.append('media', selectedFile)
      }
      await handleCreateStory(formData)
      resetStoryState()
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  // tải nội dung story nếu ko phải đang tạo tin mới
  const handleStoryClick = () => {  //upload
    setFilePreview(story?.mediaUrl)
    setFileType(story?.mediaType)
    setIsNewStory(false)
    setShowPreview(true)
  }
  //tắt xem story
  const handleClosePreview = () => {
    resetStoryState()
  }
  // reset
  const resetStoryState = () => {
    setShowPreview(false)
    setSelectedFile(null)
    setFilePreview(null)
    setFileType(null)
    setIsNewStory(false)
  }


  return (
    <>
      <Card className="w-40 h-60 relative overflow-hidden group cursor-pointer rounded-xl bg-white border-none"
        onClick={isAddStory ? undefined : handleStoryClick}
      >
        <CardContent className="p-0 h-full">
           {/*Nếu là tạo tin*/}
          {isAddStory ? (
            <div className="w-full h-full flex flex-col">
              <div className="h-3/4 w-full relative border-b">
                <Avatar className="w-full h-full rounded-none">
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt={user?.username} className="object-cover" />
                  ) : (
                    <p className='w-full h-full flex justify-center items-center text-4xl'>{userPlaceholder}</p>
                  )}
                </Avatar>
              </div>
              <div className="h-1/4 w-full bg-white flex flex-col items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8 rounded-full bg-[#54C8FD] hover:bg-[#33A3F0] new-story"
                  onClick={() => { fileInputRef.current.click() }}
                >
                  <PlusIcon className='h-5 w-5 text-white' />
                </Button>
                <p className="text-xs mt-1 font-semibold">Tạo tin</p>
              </div>
              <input
                type="file"
                accept="image/*, video/*"
                className="hidden input-new-story"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <>
             {/*Xem tin*/}
              {story?.mediaType === 'image' ? (
                <img src={story?.mediaUrl} alt={story?.user?.username} className="w-full h-full object-cover" />
              ) : (
                <video
                  src={story?.mediaUrl}
                  alt={story?.user?.username}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 left-2 ring-2 ring-blue-500 rounded-full ">
                <Avatar className="w-8 h-8 bg-gray-100">
                  {story?.user?.profilePicture ? (
                    <AvatarImage src={story?.user?.profilePicture} alt={story?.user?.username} />
                  ) : (
                    <AvatarFallback>{storyUserPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate">{story?.user?.username}</p>

              </div>
            </>
          )}
        </CardContent>
      </Card>
       {/*Nội dung tin*/}
      {showPreview && (
        <ShowStoryPreview
          file={filePreview}
          fileType={fileType}
          onClose={handleClosePreview}
          onPost={handleCreateStoryPost}
          isNewStory={isNewStory}
          userStory={isNewStory ? user : story?.user} //viet story moi thi username cua minh, nguoc lai dang xem cua ng khac
          avatar={isNewStory ? user?.profilePicture : story?.user?.profilePicture}
          isLoading={loading}
          reactions = {story?.reactions}
          reaction={story?.reactions?.find(react => react?.user?._id.toString() == user?._id) ? "tym" : null}
          onReact={(reactType) => onReact(reactType)}  // chức năng react
          onDelete={()=> onDelete()}
        />
      )}
    </>
  )
}

export default StoryCard
