import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatedDate } from "@/lib/utils";
import userStore from "@/store/userStore";
import { ChevronDown, ChevronUp, MoreHorizontal, Send } from "lucide-react";
import { AiOutlineDelete } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function PostComment({ comment, onReply, onDeleteComment, onDeleteReply, likeComment }) {
  const [showAllReplies, setShowAllReplies] = useState(false); //xem tất cả/2 cái đầu

  const [showReplies, setShowReplies] = useState(false); //mở xem replies
  const [replyText, setReplyText] = useState("");
  const { user } = userStore();
  const replyInputRef = useRef(null);
  const visibleReplies = showAllReplies //số lượng reply hiển thị
    ? comment?.replies
    : comment?.replies?.slice(0, 2);
  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join(""); // tên người dùng viết tắt

   // đăng reply 
  const handleReplySubmit = async () => {
    if (replyText.trim()) {
      onReply(replyText);
      setReplyText("");
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);  //dropdown cmt
  const [dropdownReplyOpen, setDropdownReplyOpen] = useState(null); //dropdown reply
  const [popupOpen, setPopupOpen] = useState(false);  //popup xóa cmt
  const dropdownRef = useRef(null);
  const popupRef = useRef(null);
  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setDropdownReplyOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đóng popup khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //like cmt
  const handleLikeComment = () =>{
    likeComment()
  }

  return (
    <div className="flex flex-col w-full">
      {/*Nội dung bình luận */}
      <div className="flex items-start space-x-2 mb-2 w-full">
        {/*Avt người đăng bình luận*/}
        <Avatar className="h-8 w-8">
          {comment?.user?.profilePicture ? (
            <AvatarImage
              src={comment?.user?.profilePicture}
              alt={comment?.user?.username}
            />
          ) : (
            <AvatarFallback className="bg-gray-200">
              {comment?.user?.username
                ?.split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          )}
        </Avatar>
        {/*Tên người đăng, nội dung, số lượng like, nút tùy chọn (nếu là người đăng) */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="bg-[#F0F2F5] rounded-lg px-3 py-2">
              <p className="font-semibold text-[13px]">
                {comment?.user?.username}
              </p>
              <p className="text-[15px]">{comment?.text}</p>
            </div>
            {comment?.reactions?.length > 0 && (
            <div className="flex self-end p-1 bg-white drop-shadow-xl rounded-lg gap-2 -translate-x-1/3">
              <Image src={"/like.png"} alt="haha"  width={16} height={14} unoptimized/>
              <p className="font-semibold text-[13px]">
                {comment?.reactions?.length}
              </p>
            </div>
            )}            
            {/*Nút mở dropdown*/}
            <div className="relative">
              <Button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                variant="ghost"
                className={`hover:bg-gray-100 ${comment?.user?._id === user?._id ? "flex" : "hidden"
                  }`} //chủ cmt mới có option này
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {/*Dropdown cmt*/}
              {dropdownOpen && (
                <div
                  className="absolute top-10 right-10 translate-x-full w-40 bg-white border border-gray-300 rounded-md shadow-lg"
                  ref={dropdownRef}
                >
                  <button
                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200 flex items-center gap-2"
                    onClick={() => {
                      setDropdownOpen(false);
                      setPopupOpen(true);
                    }}
                  >
                    <AiOutlineDelete
                      style={{ width: "20px", height: "20px" }}
                    />
                    Xóa bình luận
                  </button>
                </div>
              )}
            </div>
            {/*PopUp xóa cmt*/}
            {popupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                <div
                  className="bg-white p-6 rounded-lg shadow-lg"
                  ref={popupRef}
                >
                  <h2 className="text-lg font-bold mb-4">
                    Bạn có chắc chắn muốn xóa?
                  </h2>
                  <p className="text-md mb-4">
                    Hành động này không thể hoàn tác và toàn bộ phản hồi của bình luận cũng sẽ bị xóa bỏ.
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setPopupOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => {
                        setPopupOpen(false);
                        onDeleteComment();
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/*Nút like cmt, mở phản hồi, thời gian đăng bình luận*/}
          <div className="flex items-center text-xs text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 hover:underline ${comment?.reactions?.find((react => react?.user.toString() == user?._id)) ? "text-[#54C8FD]" : ""}`}
              onClick={() => { handleLikeComment() }}
            >
              Thích
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="px-2 hover:underline"
              onClick={() => setShowReplies(!showReplies)}
            >
              Phản hồi
            </Button>
            <span className="px-2 hover:underline">
              {formatedDate(comment?.createdAt)}
            </span>
          </div>
          <div
            className="font-semibold text-[13px] text-gray-500 px-2 hover:underline cursor-pointer"
            onClick={() => setShowReplies(!showReplies)}
          >
            {comment.replies.length > 0
              ? !showReplies
                ? "Hiện tất cả " + comment.replies.length + " phản hồi"
                : "Ẩn phản hồi"
              : null}
          </div>
        </div>
      </div>
      {/*Nội dung phản hồi */}
      {showReplies && (
        <div>
          {visibleReplies?.map((reply, index) => (
            <div
              key={index}
              className="flex items-start space-x-2 mt-2 ml-10 w-3/4"
            >
            {/*Avt người đăng phản hồi*/}
              <Avatar className="h-8 w-8">
                {reply.user?.profilePicture ? (
                  <AvatarImage
                    src={reply.user?.profilePicture}
                    alt={reply?.user?.username}
                  />
                ) : (
                  <AvatarFallback className="bg-gray-200">
                    {reply?.user?.username
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              {/*Tên người đăng, nội dung, nút tùy chọn (nếu là người đăng) */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="bg-[#F0F2F5] rounded-lg px-3 py-2">
                    <p className="font-semibold text-[13px]">
                      {reply?.user?.username}
                    </p>
                    <p className="text-[15px]">{reply?.text}</p>
                  </div>
                  <div className="relative">
                    <Button
                      onClick={() =>
                        setDropdownReplyOpen(
                          dropdownReplyOpen === reply?._id ? null : reply?._id
                        )
                      } //lưu id reply thay vì true/false
                      variant="ghost"
                      className={`hover:bg-gray-100 ${reply?.user?._id === user?._id ? "flex" : "hidden"
                        }`} //chủ reply mới có option này
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>      
                    {/*Dropdown xóa reply*/}
                    {dropdownReplyOpen === reply?._id && (
                      <div
                        className="absolute top-10 right-10 translate-x-full w-40 bg-white border border-gray-300 rounded-md shadow-lg"
                        ref={dropdownRef}
                      >
                        <button
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200 flex items-center gap-2"
                          onClick={() => {
                            setDropdownReplyOpen(null);
                            onDeleteReply(reply?._id);
                          }}
                        >
                          <AiOutlineDelete
                            style={{ width: "20px", height: "20px" }}
                          />
                          Xóa phản hồi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/*Nút reply, thời gian đăng*/}
                <div className="flex items-center text-xs text-gray-500">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 hover:underline"
                    onClick={() => { }}
                  >
                    Phản hồi
                  </Button>
                  <span className="px-2 hover:underline">
                    {formatedDate(comment?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {/*Tùy chọn hiển thị số lượng reply*/}
          {comment?.replies?.length > 2 && (
            <p
              className="font-semibold text-[13px] text-gray-500 px-2 hover:underline cursor-pointer ml-10"
              onClick={() => setShowAllReplies(!showAllReplies)}
            >
              {showAllReplies ? (
                <>
                  Rút gọn <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Tất cả phản hồi <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </p>
          )}
          {/*Viết phản hồi */}
          <div className="flex items-center space-x-2 w-2/3 mb-4 ml-10">
            <Avatar className="w-8 h-8">
              {user?.profilePicture ? (
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
              ) : (
                <AvatarFallback className="bg-gray-200">
                  {userPlaceholder}
                </AvatarFallback>
              )}
            </Avatar>
            <Input
              placeholder="Viết phản hồi..."
              className="flex-grow cursor-poiter rounded-full h-12"
              value={replyText}
              ref={replyInputRef}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
            />
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-transparent"
              onClick={handleReplySubmit}
            >
              <Send
                className="text-[#086280]"
                style={{ width: "20px", height: "20px" }}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostComment;
