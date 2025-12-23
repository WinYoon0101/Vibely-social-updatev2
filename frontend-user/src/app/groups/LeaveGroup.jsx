import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { useUserGroupsStore } from "@/store/userGroupsStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function LeaveGroup({ group }) {
    const {leaveGroup} = useUserGroupsStore()
    const router = useRouter()
  const handleLeave = async () => {
    try {
        await leaveGroup(group._id);
        toast.success("Bạn đã rời khỏi nhóm thành công");
        router.push('/groups')
    } catch (error) {
        console.log(error.message);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex mt-4 font-semibold cursor-pointer edit-profile hover:bg-gray-300">
          <LogOut className="w-4 h-4 mr-2" />
          Rời nhóm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className={"flex flex-col mx-4 py-2 space-y-2"}>
          <DialogTitle>Rời nhóm</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn rời khỏi nhóm <strong>{group?.name}</strong>?
            Bạn sẽ không thể xem hoặc tham gia vào các hoạt động của nhóm này
            nữa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleLeave}>
            Rời nhóm
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">
              Hủy
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveGroup;
