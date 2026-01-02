import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { userNotificationStore } from "@/store/useNotificationsStore";
import { Bell } from "lucide-react";
import React, { useState } from "react";
import NotificationItem from "./NotificationItem";

function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, setAllAsRead } = userNotificationStore();

  const handleMarkAllAsRead = async () => {
    await setAllAsRead();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:block text-gray-600 cursor-pointer pl-1"
        >
          <div
            className="relative flex items-center cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setOpen(!open)}
          >
            <Bell className="min-w-[16px] min-h-[16px] md:min-w-[24px] md:min-h-[24px]" />
            {unreadCount > 0 && (
              <div className="absolute -top-[10px] -right-1 bg-red-500 text-white text-xs flex items-center justify-center rounded-full h-3 w-3 md:w-5 md:h-5">
                {unreadCount}
              </div>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[min(400px,50vh)] w-[400px] bg-white shadow-lg rounded-lg p-4 border-gray-200 shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-800 font-bold">
            {`Thông báo (${unreadCount})`}
          </span>
          <div
            className="text-blue-500 text-xs hover:underline cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={handleMarkAllAsRead}
            onKeyDown={(e) => e.key === "Enter" && handleMarkAllAsRead()}
          >
            Đánh dấu tất cả là đã đọc
          </div>
        </div>
        <Separator />
        {notifications.length > 0 ? (
          <div className="mt-2 space-y-3">
            {notifications.map((item) => (
              <NotificationItem key={item._id} {...item} />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center py-4">
            <span className="text-gray-400">Không có thông báo mới</span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationPopover;
