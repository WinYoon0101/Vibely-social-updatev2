import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { usePostStore } from '@/store/usePostStore'
import userStore from '@/store/userStore'
import * as Popover from '@radix-ui/react-popover'
import { motion } from 'framer-motion'
import { ImageIcon, Smile, XIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false })

const NewPostForm = ({ isPostFormOpen, setIsPostFormOpen, defaultImage = null, defaultContent = "", hideTrigger = false}) => {
  const [postContent, setPostContent] = useState('')
  const { handleCreatePost } = usePostStore()
  const { user } = userStore()  //lấy thông tin người dùng
  const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join(""); //tên người dùng viết tắt
  //chọn biểu cảm
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const handleEmojiClick = (emojiObject) => {
    setPostContent((prev) => prev + emojiObject.emoji)
  }
  //chọn ảnh từ thiết bị
  const [filePreview, setFilePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileType, setFileType] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    setFileType(file.type)
    setFilePreview(URL.createObjectURL(file))
  }
  // đăng bài
  const handlePost = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('content', postContent)
      if (selectedFile) {
        formData.append('media', selectedFile)
      }
      await handleCreatePost(formData)
      setPostContent('')
      setSelectedFile(null)
      setFilePreview(null)
      setIsPostFormOpen(false)
    } catch (error) {
      //console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (defaultImage) {
      setFilePreview(defaultImage);
      setFileType('image')
  
      // Chuyển base64 thành Blob, rồi tạo File object
      fetch(defaultImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'shared-image.png', { type: blob.type });
          setSelectedFile(file);
        })
        .catch(err => {
          toast.error("Lỗi khi xử lý ảnh base64");
        });
    }
  
    if (defaultContent) {
      setPostContent(defaultContent);
    }
  }, [defaultImage, defaultContent]);

  return (
    <>
      <Dialog open={isPostFormOpen} onOpenChange={setIsPostFormOpen}>
        {!hideTrigger && (
          <Card className="bg-white border-none shadow-md rounded-lg">
            {/*Trigger - ảnh đại diện, tên, hộp thoại nhỏ*/}
            <CardContent className="p-4">
              <div className="flex space-x-4 items-center">
                <Avatar>
                  {user?.profilePicture ? (
                    <AvatarImage src={user?.profilePicture} alt={user?.username} />
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <DialogTrigger className="w-full">
                  <Input
                    placeholder={`${user?.username} ơi, bạn đang nghĩ gì?`}
                    readOnly
                    className="cursor-pointer rounded-full h-12 bg-gray-100 border-none px-4 new-post-input"
                  />
                </DialogTrigger>
              </div>
            </CardContent>
          </Card>
        )}
        {/*Dialog thêm bài viết */}
        <DialogContent className="sm:max-w-[550px] bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <p className="text-center text-lg font-semibold">
              {defaultImage ? "Chia sẻ ảnh" : "Tạo bài viết"}
            </p>
          </DialogHeader>
          <div className="border-t border-gray-200"></div>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {user?.profilePicture ? (
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
              ) : (
                <AvatarFallback>{userPlaceholder}</AvatarFallback>
              )}
            </Avatar>
            <p className="font-medium">{user?.username}</p>
          </div>
          <Textarea
            placeholder="Bạn muốn chia sẻ điều gì hôm nay?"
            className="w-full min-h-[100px] text-sm bg-gray-100 p-2 rounded-md textarea-input-post"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          {/*Ảnh/ video vừa thêm vào (nếu có)*/}
          {filePreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative mt-4 w-full bg-gray-100 flex justify-center rounded-md"
            >
              {filePreview ? (
                fileType.startsWith('image') ? (
                  <img src={filePreview} alt="Preview" className="max-h-[300px] rounded-md " />
                ) : (
                  <video src={filePreview} controls className="max-h-[300px] rounded-md " />
                )) : null}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white rounded-full p-1"
                onClick={() => {
                  setFilePreview(null)
                  setSelectedFile(null)
                }}
              >
                <XIcon className="h-5 w-5 text-gray-500" />
              </Button>

            </motion.div>
          )}
          {/*Nút thêm ảnh/video và biểu cảm */}
          <div className="flex justify-between mt-4">
            <Button variant="ghost" className="flex items-center space-x-2" onClick={() => { fileInputRef.current.click() }}>
              <ImageIcon className="h-5 w-5 text-green-500" />
              <span>Ảnh/Video</span>
              <input type="file" accept="image/*,video/*" className="hidden input-new-file" onChange={handleFileChange} ref={fileInputRef} />
            </Button>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Smile className="h-5 w-5 text-yellow-500" />
                  <span>Biểu cảm</span>
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-white shadow-lg rounded-md p-2 w-64 z-50" side="top" align="center">
                  <Picker onEmojiClick={handleEmojiClick} />
                  <Popover.Arrow className="fill-white" />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
           {/*Bảng biểu cảm */}
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="relative mt-2"
            >
              <Picker onEmojiClick={handleEmojiClick} />
            </motion.div>
          )}
          {/*Nút đăng*/}
          <div className="flex justify-end mt-4">
            <Button className="bg-blue-500 text-white w-full py-2 rounded-md"
              onClick={handlePost}>
              {defaultImage ? ( loading ? 'Đang chia sẻ...' : 'Chia sẻ' ) : (loading ? 'Đang đăng...' : 'Đăng')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewPostForm
