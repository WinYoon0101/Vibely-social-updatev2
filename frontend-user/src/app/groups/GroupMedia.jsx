import React, { useEffect } from 'react'
import { motion } from "framer-motion";
import { Card, CardContent } from '@/components/ui/card';
import { usePostStore } from '@/store/usePostStore';
import Link from 'next/link';

function GroupMedia({groupInfo}) {
  const {
    posts,
    fetchPosts
  } = usePostStore();
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  const groupPosts = posts.filter((post) => post?.group?._id === groupInfo?._id);
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 w-full"
      >
        <Card className="p-4 bg-white rounded-lg border-0 shadow-lg w-full mb-10">
          <CardContent className="p-6">
            {groupPosts?.some(
              (post) => post?.mediaUrl
            ) ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupPosts
                  ?.filter(
                    (post) => post?.mediaUrl
                  )
                  .map((post) => (
                    <Link key={post?._id} href={`/posts/${post?._id}`} className="w-[220px] h-[180px] rounded-lg cursor-pointer hover:outline hover:outline-blue-500">
                      {post?.mediaType === "image" ? (
                        <img
                        key={post?._id}
                        src={post?.mediaUrl}
                        alt="user_all_photos"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      ):(
                        <video
                        //controls
                        className="w-full h-full object-cover rounded-lg"
                      >
                        <source src={post?.mediaUrl} type="video/mp4" />
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                      </video>
                      )}
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <img
                  src="/novideo.png"
                  alt="No posts illustration"
                  className="h-[180px] mx-auto"
                />
                <p className="text-center text-gray-500">
                  Nhóm chưa có file phương tiện nào
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
  )
}

export default GroupMedia