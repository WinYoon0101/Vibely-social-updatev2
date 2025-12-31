import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import userStore from "@/store/userStore";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { MdRemoveModerator } from "react-icons/md";
import { useUserGroupsStore } from "@/store/userGroupsStore";
import toast from "react-hot-toast";

function AdminCard({ admin, isAdmin, info, refetch }) {
  const { user } = userStore((state) => state);
  const { removeAdmin } = useUserGroupsStore()
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const removeFromAdmin = async() => {
    try {
      setLoading(true);
      await removeAdmin(info._id, admin._id);
      toast.success("Đã loại bỏ quyền quản trị viên");
      refetch();
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-2 items-center relative">
      {isAdmin && user._id !== admin?._id && admin?._id !== info?.createdBy?._id && (
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
                  className="text-red-500 hover:bg-red-500 hover:text-white text-left flex gap-2"
                >
                  <MdRemoveModerator size={18} />
                  Loại khỏi quản trị viên
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Loại khỏi quản trị viên</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn loại{" "}
                  <span className="font-semibold">{admin.username}</span> khỏi
                  quản trị viên? <br />
                </DialogDescription>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    disabled={loading}
                    onClick={removeFromAdmin}
                  >
                    {loading
                      ? "Đang loại bỏ quyền..."
                      : "Loại khỏi quản trị viên"}
                  </Button>
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
        {admin.profilePicture ? (
          <AvatarImage src={admin.profilePicture} alt={admin.username} />
        ) : (
          <AvatarFallback>
            {admin.username
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        )}
      </Avatar>
      <Link
        href={`/user-profile/${admin._id}`}
        className="text-gray-500 hover:underline"
      >
        {admin.username}
      </Link>
    </div>
  );
}

export default AdminCard;
