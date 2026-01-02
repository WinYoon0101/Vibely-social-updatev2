import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { userNotificationStore } from "@/store/useNotificationsStore";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

function NotificationItem({
  _id,
  isRead,
  type,
  content,
  targetId = null,
  thumbnailUrl,
  lastSenderId = "",
  senderCount = 0,
}) {
  const getHrefByType = (type, targetId) => {
    if (!targetId) return null;

    switch (type) {
      case "friends":
        return `/user-profile/${targetId}`;

      case "posts":
        return `/posts/${targetId}`;

      case "groups":
        return `/groups/${targetId}`;

      case "system":
      default:
        return null;
    }
  };

  const href = getHrefByType(type, targetId);
  const Wrapper = href ? Link : "div";

  const { setAsRead, setAsUnread } = userNotificationStore();
  const handleClick = () => {
    if (!isRead) {
      setAsRead(_id);
    }
  };

  const [open, setOpen] = useState(false);

  const deleteNotification = (notifId) => {};
  return (
    <div className="flex w-full justify-between items-center gap-2">
        <Wrapper
      href={href}
      onClick={handleClick}
      className={`flex gap-3 flex-1 text-left items-center bg-white rounded-lg py-3 mb-2 transition
            ${href ? "cursor-pointer hover:bg-gray-200" : "cursor-default"}`}
    >
      <Avatar className="w-12 h-12">
        {thumbnailUrl ? (
          <AvatarImage src={thumbnailUrl} alt={_id} />
        ) : (
          <AvatarFallback className="bg-gray-400 text-white font-bold">
            {type?.[0]?.toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 pr-2">
        <p
          className={`text-xs ${
            !isRead ? "font-bold text-black" : "text-gray-600"
          }`}
        >
          {senderCount > 1 &&
            `${lastSenderId} và ${senderCount - 1} người khác `}
          {senderCount === 1 && `${lastSenderId} `}
          {content}
        </p>
      </div>
    </Wrapper>
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-1 rounded-full hover:bg-gray-300 transition"
          >
            <MoreHorizontal size={16} />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-48 p-1 bg-white shadow-lg rounded-md border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded disabled:text-gray-400"
            disabled={isRead}
            onClick={() => {
              setAsRead(_id);
              setOpen(false);
            }}
          >
            Đánh dấu là đã đọc
          </button>

          <button
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded disabled:text-gray-400`}
            disabled={!isRead}
            onClick={() => {
              setAsUnread(_id);
              setOpen(false);
            }}
          >
            Đánh dấu là chưa đọc
          </button>

          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600"
            onClick={() => {
              deleteNotification(_id);
              setOpen(false);
            }}
          >
            Xóa thông báo
          </button>
        </PopoverContent>
      </Popover>
    </div>
    
  );
}

export default NotificationItem;
