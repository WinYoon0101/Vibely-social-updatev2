import React, { useEffect, useState } from "react";
import CreateGroupPost from "./CreateGroupPost";
import PostCard from "../posts/PostCard";
import { usePostStore } from "@/store/usePostStore";
import userStore from "@/store/userStore";

function GroupPosts({ groupInfo }) {
  const {
    posts,
    fetchPosts,
    handleEditPost,
    handleReactPost,
    handleCommentPost,
    handleSharePost,
    handleDeletePost,
  } = usePostStore();
  const groupPosts = posts.filter((post) => post?.group?._id === groupInfo?._id);
  useEffect(() => {
    fetchPosts(); //tải các bài viết
  }, [fetchPosts]);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const user = userStore((state) => state.user);
  const isMember = groupInfo?.members.find((member) => member._id === user._id);
  return (
    <main className="w-full flex flex-col" style={{ overflowAnchor: "none" }}> 
      <div className="mt-2">
        {isMember && (
          <CreateGroupPost
            groupId={groupInfo?._id}
            groupName={groupInfo?.name}
            isPostFormOpen={isPostFormOpen}
            setIsPostFormOpen={setIsPostFormOpen}
          />
        )}
      </div>
      {groupPosts.length <= 0 ? (
        <div className="w-full text-center font-semibold text-[1.2rem] text-gray-800 py-10">
          Nhóm chưa có bài viết nào.
        </div>
      ):(
        <div className="mt-2 space-y-6 mb-10">
        {groupPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onReact={async (reactType) => {
              await handleReactPost(post?._id, reactType);
              await fetchPosts();
            }}
            onComment={async (commentText) => {
              await handleCommentPost(post?._id, commentText);
              await fetchPosts();
            }}
            onShare={async () => {
              await handleSharePost(post?._id);
              await fetchPosts();
            }}
            onDelete={async () => {
              await handleDeletePost(post?._id);
              await fetchPosts();
            }}
            onEdit={async (postData) => {
              await handleEditPost(post?._id, postData);
              await fetchPosts();
            }}
          />
        ))}
      </div>
      )}
    </main>
  );
}

export default GroupPosts;
