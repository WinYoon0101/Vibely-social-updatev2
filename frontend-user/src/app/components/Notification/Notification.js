import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Notification = ({ isBold, title, message, image, username }) => {
  return (
    <div className="flex gap-3 text-left items-center bg-white rounded-lg py-3 mb-2 cursor-pointer hover:bg-gray-200 transition">
      {/* Avatar */}
      <Avatar className="w-12 h-12">
        {image ? (
          <AvatarImage src={image} alt={username} />
        ) : (
          <AvatarFallback className="bg-gray-400 text-white font-bold">
            {username?.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        )}
      </Avatar>

      {/* Nội dung thông báo */}
      <div className="flex-1">
        <h4 className={`text-[15px] pb-1 ${isBold ? "font-bold text-black" : "text-gray-800"}`}>
          {title}
        </h4>
        <p className={`text-gray-600 text-xs ${isBold ? "font-bold text-black" : ""}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Notification;
