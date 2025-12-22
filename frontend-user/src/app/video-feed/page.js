"use client";
//import React from "react";
import LeftSideBar from "../components/LeftSideBar";
import VideoCard from "./VideoCard";
import { useEffect } from 'react';
import { usePostStore } from '@/store/usePostStore';

const Page = () => {
    //lấy các bài viết, story, phương thức từ usePostStore
    const {posts, fetchPosts, handleReactPost, handleCommentPost, handleSharePost } = usePostStore() ;
    useEffect(()=>{
      fetchPosts()  //tải các bài viết
    },[fetchPosts])
    const videoPost = posts?.filter(post => post.mediaType === "video") //lấy bài viết có mediaType là video

    return (
        <div className='mt-12 min-h-screen'>
            <LeftSideBar/>
            <main className='ml-0 md:ml-64 p-6'>
                <div className='max-w-3xl mx-auto mt-3'>
                  {/*danh sách các video*/}
                    {videoPost.map((post) => (
                        <VideoCard
                            key={post?._id}
                            post={post}
                            onReact={async (reactType) => {
                              await handleReactPost(post?._id, reactType)
                              await fetchPosts()// tải lại danh sách
                            }}
                            onComment={async (commentText) => {  //chức năng comment
                              await handleCommentPost(post?._id, commentText)
                              await fetchPosts()
                            }}
                            onShare={async () => {  //chức năng share
                              await handleSharePost(post?._id)
                              await fetchPosts()
                            }}
                        />
                    ))}
                </div>
            </main>
    </div>
  )
}

export default Page