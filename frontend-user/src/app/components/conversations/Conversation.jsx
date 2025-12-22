import "./conversation.css";

export default function Conversation({ friend, currentChat }) {
  const isActive = currentChat?.members?.includes(friend._id);

  // Đoạn hội thoại
  return (
    <div>
      <div
        className={`conversation ${isActive ? "bg-[#CDE8FF]" : "hover:bg-[#E8F4FF]"}`}
        key={friend?._id}>
        <img
          className="conversationImg"
          src={friend?.profilePicture || "/images/user_default.jpg"}
          alt={friend?.username}
        />
        <span className="conversationName">{friend?.username}</span>
      </div>
    </div>
  );
}
