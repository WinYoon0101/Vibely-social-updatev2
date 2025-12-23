import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PenLine } from "lucide-react";
import React from "react";

function EditGroupDialog({ groupInfo }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex mt-4 font-semibold cursor-pointer bg-[#086280] hover:bg-[#086280]/70 text-white">
          <PenLine className="w-4 h-4 mr-2" />
          Chỉnh sửa thông tin nhóm
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogTitle>Chỉnh sửa thông tin nhóm</DialogTitle>
      </DialogContent>
    </Dialog>
  );
}

export default EditGroupDialog;
