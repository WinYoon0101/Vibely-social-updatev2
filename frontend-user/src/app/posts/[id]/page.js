"use client";
import React, { useEffect, useState } from 'react'
import { useParams } from "next/navigation";
import { getSinglePost } from '@/service/post.service';
import PostCard from '../PostCard';
import { usePostStore } from '@/store/usePostStore'
import toast from 'react-hot-toast';

function Page() {
    const params = useParams();
    const postId = params.id;   //postId
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(false);
    const [forbidden, setForbidden] = useState(false);
    const { handleReactPost, handleCommentPost, handleSharePost, handleDeletePost } = usePostStore();
    const fetchPost = async () => {
        setLoading(true);
        try {
          const result = await getSinglePost(postId);
          setPost(result);
        } catch (error) {
          if (error.response && error.response.status === 403) {
            setForbidden(true)
          }
        } finally {
          setLoading(false);
        }
    };
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return (
    <div className='max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pt-16 mt-4'>
      {forbidden && <p className='w-full font-semibold text-[1.5rem] text-center mt-20'>Bạn không có quyền xem bài viết này.</p>}
      {post &&
        <PostCard
          post={post}
          onReact={async (reactType) => {
            await handleReactPost(post?._id, reactType)
            await fetchPost()
          }}  // chức năng react
          onComment={async (commentText) => {  //chức năng comment
            await handleCommentPost(post?._id, commentText)
            await fetchPost()
          }}
          onShare={async () => {  //chức năng share
            await handleSharePost(post?._id)
            await fetchPost()
          }}
          onDelete={async () => {  //chức năng xóa
            await handleDeletePost(post?._id)
            await fetchPost()
          }}
        />
      }
    </div>
  )
}

export default Page