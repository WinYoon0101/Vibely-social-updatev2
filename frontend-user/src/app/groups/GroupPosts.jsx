import React, { useEffect, useState } from "react";
import CreateGroupPost from "./CreateGroupPost";
import PostCard from "../posts/PostCard";
import { usePostStore } from "@/store/usePostStore";

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
  return (
    <main className="w-full flex flex-col">
      <div className="mt-6">
        <CreateGroupPost
          groupId={groupInfo?._id}
          groupName={groupInfo?.name}
          isPostFormOpen={isPostFormOpen}
          setIsPostFormOpen={setIsPostFormOpen}
        />
      </div>
      <div className="mt-6 space-y-6">
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
    </main>
  );
}

export default GroupPosts;
