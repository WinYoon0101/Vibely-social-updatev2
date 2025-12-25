import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserGroupsStore } from "@/store/userGroupsStore";
import userStore from "@/store/userStore";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaUserTimes } from "react-icons/fa";
import { MdAddModerator } from "react-icons/md";

function MemberCard({ member, isAdmin, info, refetch }) {
  const { user } = userStore((state) => state);
  const { addAdmin, kickMember } = useUserGroupsStore();
  const [open, setOpen] = useState(false);
  const [openKick, setOpenKick] = useState(false);
  const [loading, setLoading] = useState(false);

  const addIntoAdmin = async () => {
    try {
      setLoading(true);
      await addAdmin(info._id, member._id);
      toast.success("Đã loại bỏ quyền quản trị viên");
      refetch();
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const kickOutOfGroup = async () => {
    try {
      setLoading(true);
      await kickMember(info._id, member._id);
      toast.success("Đã kick người dùng khỏi nhóm.");
      refetch();
      setOpenKick(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const thisIsAdmin = info?.admins.find((admin) => admin._id === member._id);
  return (
    <div className="flex gap-2 items-center relative">
      {isAdmin &&
        user._id !== member?._id &&
        member?._id !== info?.createdBy?._id && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                veriant="ghost"
                className="absolute top-1/2 -translate-y-1/2 right-0 w-5 h-5 hover:bg-gray-200"
              >
                <Ellipsis className="w-4 h-4" />
                <span className="sr-only">Options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full max-w-md bg-white border-gray-300 shadow-lg flex flex-col gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    disabled={thisIsAdmin}
                    className="hover:bg-gray-200 flex gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdAddModerator size={18} />
                    Thêm vào quản trị viên
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Thêm vào quản trị viên</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn thêm{" "}
                    <span className="font-semibold">{member?.username}</span> vào
                    quản trị viên? <br />
                    Người dùng này sẽ có quyền thay đổi cài đặt nhóm và quản lý
                    thành viên, bao gồm cả bạn (trừ người sáng lập).
                  </DialogDescription>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Hủy</Button>
                    </DialogClose>
                    <Button
                      className="bg-blue-500 hover:bg-blue-800 text-white"
                      disabled={loading}
                      onClick={addIntoAdmin}
                    >
                      {loading ? "Đang cấp quyền..." : "Thêm vào quản trị viên"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={openKick} onOpenChange={setOpenKick}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:bg-red-500 hover:text-white text-left flex gap-2"
                  >
                    <FaUserTimes size={18} />
                    Loại khỏi nhóm
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Loại khỏi nhóm</DialogTitle>
                  <DialogDescription>
                    Bạn có chắc chắn muốn loại{" "}
                    <span className="font-semibold">{member.username}</span>{" "}
                    khỏi nhóm không?
                  </DialogDescription>
                  <DialogFooter>
                    <Button variant="destructive" disabled={loading} onClick={kickOutOfGroup}>{loading?"Đang kick người dùng...":"Loại khỏi nhóm"}</Button>
                    <DialogClose asChild>
                      <Button variant="outline">Hủy</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </PopoverContent>
          </Popover>
        )}
      <Avatar className="!outline outline-1 outline-blue-500">
        {member.profilePicture ? (
          <AvatarImage src={member.profilePicture} alt={member.username} />
        ) : (
          <AvatarFallback>
            {member.username
              .split(" ")
              .map((name) => member[0])
              .join("")}
          </AvatarFallback>
        )}
      </Avatar>
      <Link
        href={`/user-profile/${member._id}`}
        className="text-gray-500 hover:underline"
      >
        {member.username}
      </Link>
    </div>
  );
}

export default MemberCard;
