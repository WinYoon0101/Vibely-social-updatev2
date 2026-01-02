import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserGroupsStore } from "@/store/userGroupsStore";
import { Lock, LogIn, Users } from "lucide-react";
import React, { useState } from "react";

function JoinGroupDialog({ group }) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const { joinGroup } = useUserGroupsStore();
    const handleJoinGroup = async()=>{
        try {
            setLoading(true)
            await joinGroup(group._id)
            setOpen(false)
        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }
    }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-blue-500 text-white hover:bg-blue-800" size="lg">
          <LogIn className="mr-2 h-4 w-4" /> Tham gia nhóm
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <img
            src={group?.coverPhotoUrl}
            alt={group.name}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <DialogTitle>{group.name}</DialogTitle>
          <p className="my-1">{group.description}</p>
          <div className="flex gap-2 items-center">
            <p className="text-sm">Được tạo bởi: </p>
            <img
              src={group?.createdBy?.profilePicture}
              alt={group.createdBy.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-semibold ml-2">
              {group.createdBy.username}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <Users size={20} />
            <span>{group.members.length} thành viên</span>
          </div>
          <div className="flex gap-2 items-center">
            <Lock size={20} />
            <span>
              {group.privacySetting === "private"
                ? "Nhóm riêng tư"
                : "Nhóm công khai"}
            </span>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-800"
            size="lg"
            onClick={handleJoinGroup}
            disabled={loading}
          >
            <LogIn className="mr-2 h-4 w-4" /> {loading ? "Đang tham gia..." : "Tham gia nhóm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default JoinGroupDialog;
