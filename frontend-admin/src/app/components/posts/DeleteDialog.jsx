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
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

function DeleteDialog({ handleDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-30 md:w-40 text-sm md:text-[20px] h-8 md:h-10 cursor-pointer hover:bg-gray-700 text-white bg-[#DF0000] font-['Roboto_Condensed'] rounded-[25px] overflow-hidden">
          <MdDelete className="w-10 h-10" />
          Xóa bài viết
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center font-['Roboto_Condensed'] text-lg md:text-2xl">
            Xóa bài viết
          </DialogTitle>
          <DialogDescription className="mt-4 text-center text-sm md:text-base">
            Bài viết bị xóa sẽ không thể khôi phục lại được. Bạn có chắc chắn
            muốn tiếp tục xóa?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-4 items-center justify-end">
          <Button
            className={"bg-red-500 hover:bg-red-700 cursor-pointer text-white"}
            onClick={() => {
              handleDelete();
              setOpen(false);
            }}
          >
            Xóa bài viết
          </Button>
          <DialogClose asChild>
            <Button className={"bg-gray-100 hover:bg-gray-300 cursor-pointer"}>Hủy</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
