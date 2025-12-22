import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat, setSelectedFriend, mode }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

  // Lấy danh sách bạn bè của người dùng hiện tại
  useEffect(() => {
    const getFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Lỗi: Không tìm thấy token");
          return;
        }

        const res = await axios.get(`${API_URL}/users/mutual-friends/${currentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFriends(res.data.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách bạn bè:", error.response?.data || error.message);
      }
    };

    if (currentId) getFriends();
  }, [currentId]);

  // Lọc danh sách bạn bè đang online
  useEffect(() => {
    if (friends.length > 0 && onlineUsers.length > 0) {
      const onlineOnly = friends.filter((friend) => onlineUsers.includes(friend._id));
      setOnlineFriends(onlineOnly);
    } else {
      setOnlineFriends([]);
    }
  }, [friends, onlineUsers]);

  // Xử lý khi người dùng nhấp vào bạn bè online
  const handleClick = async (user) => {
    try {
      const res = await axios.post(`${API_URL}/conversation`, {
        senderId: currentId,
        receiverId: user._id,
      });
      setCurrentChat(res.data);
      setSelectedFriend(user);
    }
    catch (err) {
      console.error("❌ Lỗi khi tạo hoặc lấy cuộc trò chuyện:", err);
    }
  }

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const endMouseDrag = () => setIsDragging(false);

  const onTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const onTouchEnd = () => setIsDragging(false);
  return (
    <>
      {mode ?
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap cursor-grab active:cursor-grabbing mr-10"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endMouseDrag}
          onMouseLeave={endMouseDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex">
            {onlineFriends.length > 0 ? (
              <>
                {onlineFriends.map((online) => (
                  <div className="flex flex-col items-center flex-shrink-0 cursor-pointer w-[84px]" key={online._id} onClick={() => { handleClick(online) }}>
                    <div className="relative flex items-center w-[72px]">
                      <img className="object-contain rounded-full w-16 h-16" src={online.profilePicture || "images/user_default.jpg"} alt={online.username} />
                      <div className="bg-[#4CAF50] rounded-full w-4 h-4 absolute bottom-1 right-1 border-white border"></div>
                    </div>
                    <p className="w-20 truncate text-center">{online.username}</p>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex w-full text-center justify-center items-center h-full">
                <p className="">Không có bạn bè nào đang online</p>
              </div>
            )}
          </div>
        </div>
        :
        <div className="chatOnline h-full">
          <h1 className="text-xl font-bold mt-5 ml-2">Bạn bè online</h1>

          {onlineFriends.length > 0 ? (
            <>
              {onlineFriends.map((online) => (
                <div className="chatOnlineFriend" key={online._id} onClick={() => { handleClick(online) }}>
                  <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg" src={online.profilePicture || "images/user_default.jpg"} alt={online.username} />
                    <div className="chatOnlineBadge"></div>
                  </div>
                  <span className="chatOnlineName">{online.username}</span>
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center text-center h-full">
              <p className="">Không có bạn bè nào đang online</p>
            </div>
          )}
        </div>
      }</>
  );
}
