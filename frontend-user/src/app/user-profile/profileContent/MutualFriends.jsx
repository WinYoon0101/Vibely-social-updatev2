import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@radix-ui/react-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, UserX } from "lucide-react";
import { userFriendStore } from "@/store/userFriendsStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const MutualFriends = ({ id, isOwner }) => {
  const { fetchMutualFriends, mutualFriends, UnfollowUser } = userFriendStore();
  const router = useRouter();
  const handleNavigation = (path, item) => {
    router.push(path);
  };
  useEffect(() => {
    if (id) {
      fetchMutualFriends(id);
    }
  }, [id, fetchMutualFriends]);

  const handleUnfollow = async (userId) => {
    await UnfollowUser(userId);
    toast.success("Bạn đã hủy kết bạn thành công");
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFriends = mutualFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const Tabs = ({className}) =>{
    return(
      <div className={`flex flex-wrap gap-4 justify-end md:w-[260px] ${className}`}>
          <p
            className="text-[#086280] font-semibold cursor-pointer"
            onClick={() => handleNavigation("/friends-list")}
          >
            Lời mời kết bạn
          </p>
          <p
            className="text-[#086280] font-semibold cursor-pointer"
            onClick={() => handleNavigation("/friends-list")}
          >
            Tìm bạn bè
          </p>
      </div>
    )
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card className="bg-white shadow-md rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-4 relative">
      {/* Trái: Tiêu đề */}
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold dark:text-gray-300 md:w-[160px]">Bạn bè</p>
        <Tabs className="md:hidden"/>
      </div>
      

      {/* Giữa: Thanh tìm kiếm */}
      <div className="relative flex items-center w-full md:flex-1">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-6 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#086280]"
        />
        <button className="ml-2 p-2 bg-[#086280] text-white rounded-lg hover:bg-[#064d5f]">
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Phải: Tabs điều hướng */}
      {isOwner && (
        <Tabs className="hidden md:inline-flex"/>
      )}
      
    </div>


        <CardContent>
          {/* Danh sách bạn bè */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="flex items-center justify-between bg-white shadow-md rounded-lg border border-gray-200 p-3"
              >
                {/* Avatar + Tên */}
                <div className="flex items-center space-x-4 rounded-md">
                  <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-700">
                    {friend?.profilePicture ? (
                      <AvatarImage
                        src={friend?.profilePicture}
                        alt={friend?.username}
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-400">
                        {friend?.username
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-semibold dark:text-gray-100">
                      {friend?.username}
                    </p>
                    <p className="text-sm text-gray-400">
                      {friend?.followerCount} người theo dõi
                    </p>
                  </div>
                </div>

                {/* Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5 text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  {isOwner && (
                    <DropdownMenuContent
                      align="end"
                      onClick={async () => {
                        await handleUnfollow(friend?._id);
                        await fetchMutualFriends(id);
                      }}
                    >
                      <DropdownMenuItem className="flex items-center text-red-500 cursor-pointer">
                        <UserX className="h-4 w-4 mr-2" /> Hủy kết bạn
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
