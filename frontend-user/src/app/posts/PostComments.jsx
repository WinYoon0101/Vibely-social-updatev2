//import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatedDate } from "@/lib/utils";
import userStore from "@/store/userStore";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { useEffect, useState } from "react";
import PostComment from "./PostComment";
import { usePostStore } from "@/store/usePostStore";
const PostComments = ({ post, onComment, commentInputRef }) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const [commentText, setCommentText] = useState("")
    const { user } = userStore();
    const visibleComments = showAllComments ? post?.comments : post?.comments?.slice(0, 2);
    const userPlaceholder = user?.username?.split(" ").map((name) => name[0]).join(""); // tên người dùng viết tắt

    const {fetchPosts,handleReplyComment, handleDeleteComment, handleDeleteReply, handleLikeComment} = usePostStore()
    const handleCommentSubmit = async() =>{
        if(commentText.trim()){
            onComment({text : commentText})
            setCommentText("")
        }
    }
    return (
        <div className="mt-2">
            <h3 className="font-semibold mb-3">Bình luận</h3>
            <div className="max-h-60 overflow-y-auto pr-2">
                {/*Danh sách các cmt*/}
                {visibleComments?.map((comment, index) => (

                    <PostComment key={index} comment={comment} 
                    onReply={async(replyText)=>{
                        await handleReplyComment(post?._id,comment?._id,replyText)
                        await fetchPosts()
                    }}
                    onDeleteComment={async()=>{
                        await handleDeleteComment(post?._id,comment?._id)
                        await fetchPosts()
                    }}
                    onDeleteReply={async(replyId)=>{
                        await handleDeleteReply(post?._id,comment?._id,replyId)
                        await fetchPosts()
                    }}
                    likeComment={async()=>{
                        await handleLikeComment(post?._id,comment?._id)
                        await fetchPosts()
                    }}
                    />
                ))}
                {/*Tùy chỉnh hiển thị số lượng cmt*/}
                {post?.comments?.length > 2 && (
                    <p
                        className="w-40 mt-2 text-blue-500 cursor-pointer text-[16px] hover:underline"
                        onClick={() => setShowAllComments(!showAllComments)}
                    >
                        {showAllComments ? (
                            <>Rút gọn <ChevronUp className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>Tất cả bình luận <ChevronDown className="ml-2 h-4 w-4" /></>
                        )}
                    </p>
                )}
            </div>
            {/*Viết bình luận*/}
            <div className="flex items-center space-x-2 mt-4">
                <Avatar className='w-8 h-8'>
                    {user?.profilePicture ? (
                        <AvatarImage src={user?.profilePicture} alt={user?.username} />
                    ) : (
                        <AvatarFallback className="bg-gray-200">{userPlaceholder}</AvatarFallback>
                    )}
                </Avatar>
                <Input
                    placeholder="Viết bình luận..."
                    className="flex-grow cursor-poiter rounded-full h-12 "
                    value={commentText}
                    ref={commentInputRef}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <Button variant="ghost" size="icon" className="hover:bg-transparent"
                    onClick={handleCommentSubmit}
                >
                    <Send className="text-[#086280]" style={{ width: "20px", height: "20px" }} />
                </Button>
            </div>
        </div>
    )
}

export default PostComments;