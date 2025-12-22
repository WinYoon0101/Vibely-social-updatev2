import React from "react";
import { FaTrash } from "react-icons/fa";

const PostItem = ({ post }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <div className="flex justify-between">
                {/* Left column - Author info and content */}
                <div className="flex-1 pr-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold">{post.author}</p>
                            <p className="text-sm text-gray-500">{post.time}</p>
                        </div>
                    </div>
                    <div>
                        <p className="mb-2">{post.content}</p>
                        {post.image && (
                            <img src={post.image} alt="post" className="max-w-[500px] max-h-[300px] object-cover rounded-lg" />
                        )}
                    </div>
                </div>

                {/* Right column - Stats and actions */}
                <div className="w-1/2 p-4 rounded-lg flex flex-col gap-2 mt-10">
                    {/* Số lượt bày tỏ cảm xúc */}
                    <div className="text-gray-600">
                        <p className="text-gray-600">Số lượt bày tỏ cảm xúc: <span className="text-black font-semibold">{post.reactions.total}</span></p>
                        <div className="flex items-center gap-10 mt-4">
                            <div className="flex items-center gap-1">
                                <img src="/images/like.png" alt="like" className="w-6 h-6 mr-2 " />
                                <span>{post.reactions.like}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src="/images/love.png" alt="heart" className="w-6 h-6 mr-2" />
                                <span>{post.reactions.heart}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src="/images/haha.png" alt="laugh" className="w-6 h-6 mr-2" />
                                <span>{post.reactions.laugh}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src="/images/wow.png" alt="wow" className="w-6 h-6 mr-2" />
                                <span>{post.reactions.wow}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src="/images/sad.png" alt="sad" className="w-6 h-6 mr-2" />
                                <span>{post.reactions.sad}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <img src="/images/angry.png" alt="angry" className="w-6 h-6 mr-2" />
                                <span>{post.reactions.angry}</span>
                            </div>
                        </div>
                    </div>

                    {/* Số lượt bình luận */}
                    <p className="text-gray-600 mt-4">
                        Số lượt bình luận: <span className="text-black font-semibold">{post.comments}</span>
                    </p>

                    {/* Số lượt chia sẻ */}
                    <p className="text-gray-600 mt-4">
                        Số lượt chia sẻ: <span className="text-black font-semibold">{post.shares}</span>
                    </p>

                    {/* Nút xóa bài viết */}
                    <button className="mt-14 bg-[#DF0000] font-semibold text-white px-4 py-2 rounded-lg flex items-center gap-2 self-end hover:bg-red-600 cursor-pointer">
                        <FaTrash className="mr-2"/>
                        Xóa bài viết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostItem;
