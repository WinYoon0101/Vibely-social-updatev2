"use client";

import { useEffect, useState } from "react";
import { useChatContext } from "stream-chat-react";
import {
  Channel,
  MessageList,
  MessageInput,
  Window,
  Thread,
} from "stream-chat-react";
import { X } from "lucide-react";

const ChatPanel = ({ meetingId, onClose }) => {
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!client || !meetingId) return;

    const initChannel = async () => {
      try {
        // Create or get existing channel for this meeting
        const newChannel = client.channel("messaging", meetingId, {
          name: `Meeting ${meetingId}`,
        });

        await newChannel.watch();
        setChannel(newChannel);
      } catch (error) {
        console.error("Error initializing chat channel:", error);
      }
    };

    initChannel();

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [client, meetingId]);

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white/50">Đang tải chat...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a] ">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#3c4043]">
        <h3 className="text-white font-medium">Trò chuyện</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Channel */}
      <div className="flex-1 overflow-hidden meeting-chat-panel">
        <Channel channel={channel}>
          <Window>
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </div>
    </div>
  );
};

export default ChatPanel;
