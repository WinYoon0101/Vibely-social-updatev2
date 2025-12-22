"use client"
import StorySection from '@/app/story/StorySection'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LeftSideBar from '../components/LeftSideBar'
import RightSideBar from '../components/RightSideBar'
import NewPostForm from '../posts/NewPostForm'
import PostCard from '../posts/PostCard'
import { usePostStore } from '@/store/usePostStore'
import Chatbot from "../components/chatbot/page";

const Homepage = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  //lấy các bài viết, story, phương thức từ usePostStore
  const { posts, fetchPosts, handleEditPost, handleReactPost, handleCommentPost, handleSharePost, handleDeletePost } = usePostStore();
  const router = useRouter()

  const handleNavigation = (path) => {
    window.open(path, "_blank")
  }
  useEffect(() => {
    fetchPosts()  //tải các bài viết
  }, [fetchPosts])

  return (
    <div className="flex flex-col min-h-screen text-foreground">
      <main className="flex flex-1">
        <LeftSideBar />
        <div className="flex w-full flex-1 px-1 md:px-16 py-6 md:ml-64 lg:mr-64 xl:mr-80 mt-14">
          <div className="lg:ml-2 xl:ml-[104px]">
            <div className="-mt-8">
              <StorySection />
            </div>
            <div className="mt-6">
              <NewPostForm
                isPostFormOpen={isPostFormOpen}
                setIsPostFormOpen={setIsPostFormOpen}
              />
            </div>

            <div className='mt-6 space-y-6'>
              {posts.map(post => (
                <PostCard key={post._id}
                  post={post}
                  onReact={async (reactType) => {
                    await handleReactPost(post?._id, reactType)
                    await fetchPosts()// tải lại danh sách
                  }}  // chức năng react
                  onComment={async (commentText) => {  //chức năng comment
                    //console.log("onComment: ",commentText)
                    await handleCommentPost(post?._id, commentText)
                    await fetchPosts()
                  }}
                  onShare={async () => {  //chức năng share
                    await handleSharePost(post?._id)
                    await fetchPosts()
                  }}
                  onDelete={async () => {  //chức năng xóa
                    await handleDeletePost(post?._id)
                    await fetchPosts()
                  }}
                  onEdit={async (postData) => {
                    await handleEditPost(post?._id, postData)
                    await fetchPosts()
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:w-64 xl:w-80 fixed top-16 right-0 bottom-0 overflow-y-auto p-4">
          <RightSideBar />
        </div>
      </main>
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-white rounded-full shadow-lg hover:scale-110 transition duration-300"
      >
        <img
          src="/images/chatbot.png"
          alt="Chatbot"
          className="w-full h-full object-cover rounded-full"
        />
      </button>

      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  )
}

export default Homepage