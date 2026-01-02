import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { inviteFriend } from "@/service/group.service";
import { getMutualFriends } from "@/service/user.service";
import userStore from "@/store/userStore";
import { ChevronLeftIcon, SmilePlus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function InviteFriends({ info, refetch }) {
  const [mutualFriends, setMutual ] = useState([]);
  const { user } = userStore();
  const fetchFriends = async () => {
    const friends = await getMutualFriends(user?._id);
    setMutual(friends || []);
  };
  useEffect(() => {
    fetchFriends();
  }, []);
  const invited = (friend) => {
  const friendId = friend._id.toString();
  return (
    info?.members?.some(id => id.toString() === friendId) ||
    info?.invitedUsers?.some(id => id.toString() === friendId)
  );
};
  const inviteFriends = async (groupId, friendId) => {
    try {
      await inviteFriend(groupId, friendId);
      refetch();
      toast.success("Đã mời bạn bè vào nhóm thành công");
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi mời bạn bè vào nhóm");
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex mt-4 font-semibold cursor-pointer bg-[#086280] hover:bg-[#086280]/70 text-white">
          <SmilePlus className="w-4 h-4 mr-2" />
          Mời bạn bè
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[min(600px,80vh)] flex flex-col gap-0 py-4 sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="p-2 text-center w-full">
            Mời bạn bè tham gia nhóm
          </DialogTitle>
          {mutualFriends?.length === 0 ? (
            <div className="w-full text-gray-500 font-semibold text-center p-6">
              Bạn không có người bạn nào để mời vào nhóm.
            </div>
          ) : (
            <ScrollArea className="flex max-h-full flex-col overflow-hidden py-2">
              {mutualFriends?.map((friend, index) => {
                return (
                  <div
                    key={index}
                    className="w-full p-2 flex justify-between items-center border-b border-gray-200"
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar className="!outline outline-1 outline-blue-500">
                        {friend?.profilePicture ? (
                          <AvatarImage
                            src={friend?.profilePicture}
                            alt={friend?.username}
                          />
                        ) : (
                          <AvatarFallback>
                            {friend?.username
                              .split(" ")
                              .map((name) => name[0])
                              .join("")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Link
                        href={`/user-profile/${friend?._id}`}
                        className="text-gray-500 hover:underline"
                      >
                        {friend.username}
                      </Link>
                    </div>

                    <Button
                      className="bg-[#086280] hover:bg-[#086280]/70 text-white rounded-lg p-2 disabled:opacity-50"
                      disabled={invited(friend)}
                      onClick={() => inviteFriends(info?._id, friend?._id)}
                    >
                      {invited(friend) ? "Đã mời" : "Mời"}
                    </Button>
                  </div>
                );
              })}
            </ScrollArea>
          )}
        </DialogHeader>
        <DialogFooter className="flex-row items-center justify-end border-t p-2">
          <DialogClose asChild>
            <Button variant="outline" className="hover:bg-gray-300">
              <ChevronLeftIcon />
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>     
    </Dialog>
  );
}

export default InviteFriends;
