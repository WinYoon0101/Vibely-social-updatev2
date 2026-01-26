"use client";

import { useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";
import { Chat, Streami18n } from "stream-chat-react";

import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/app/components/meeting/Loader";
import userStore from "@/store/userStore";

import "stream-chat-react/dist/css/v2/index.css";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// Vietnamese translations for Stream Chat
const vietnameseTranslations = {
  "Type your message": "Nhập tin nhắn...",
  Send: "Gửi",
  "Edit Message": "Chỉnh sửa tin nhắn",
  "Delete Message": "Xóa tin nhắn",
  Reply: "Trả lời",
  Cancel: "Hủy",
  Emoji: "Biểu tượng cảm xúc",
  "Attach files": "Đính kèm",
  "This message was deleted...": "Tin nhắn đã bị xóa...",
  "Message deleted": "Tin nhắn đã xóa",
  "Only visible to you": "Chỉ bạn nhìn thấy",
  Edit: "Sửa",
  Delete: "Xóa",
  Pin: "Ghim",
  Unpin: "Bỏ ghim",
  Flag: "Báo cáo",
  Mute: "Tắt tiếng",
  Unmute: "Bật tiếng",
  "Copy Message Text": "Sao chép tin nhắn",
  "Thread Reply": "Trả lời trong luồng",
  "View thread": "Xem luồng tin",
  Search: "Tìm kiếm",
  "No results found": "Không tìm thấy kết quả",
  "Loading...": "Đang tải...",
  "New Messages": "Tin nhắn mới",
  Yesterday: "Hôm qua",
  Today: "Hôm nay",
  "Nothing yet...": "Chưa có gì...",
  "Start of a new thread": "Bắt đầu cuộc trò chuyện",
  "Message copied to clipboard!": "Đã sao chép tin nhắn!",
  You: "Bạn",
  and: "và",
  "is typing...": "đang nhập...",
  "are typing...": "đang nhập...",
  Attach: "Đính kèm",
  "Pick your emoji": "Chọn biểu tượng cảm xúc",
};

// Initialize i18n
const i18nInstance = new Streami18n({
  language: "vi",
  translationsForLanguage: vietnameseTranslations,
});

const StreamVideoProvider = ({ children }) => {
  const [videoClient, setVideoClient] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const user = userStore((state) => state.user);

  useEffect(() => {
    if (!user) return;
    if (!API_KEY) throw new Error("Stream API key is missing");

    const initClients = async () => {
      try {
        // Initialize Video Client
        const vClient = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: user._id,
            name: user.username,
            image: user.profilePicture || undefined,
          },
          tokenProvider: () => tokenProvider(user._id),
        });

        // Initialize Chat Client
        const cClient = StreamChat.getInstance(API_KEY);

        const token = await tokenProvider(user._id);

        await cClient.connectUser(
          {
            id: user._id,
            name: user.username,
            image: user.profilePicture || undefined,
          },
          token,
        );

        setVideoClient(vClient);
        setChatClient(cClient);
      } catch (error) {
        console.error("Error initializing Stream clients:", error);
      }
    };

    initClients();

    // Cleanup
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [user]);

  if (!user || !videoClient || !chatClient) return <Loader />;

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient} i18nInstance={i18nInstance}>
        {children}
      </Chat>
    </StreamVideo>
  );
};

export default StreamVideoProvider;
