import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/service/group.service";
import { Check } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

function AcceptInvitation({groupInfo, refetch}) {
  const handleAccept = async() => {
    try {
      await acceptInvitation(groupInfo?._id);
      toast.success("Tham gia nhóm thành công");
      refetch()
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi chấp nhận lời mời vào nhóm");
    }
  }
  return (
    <Button className="flex mt-4 font-semibold cursor-pointer bg-[#086280] hover:bg-[#086280]/70 text-white" onClick={handleAccept}>
      <Check className="w-4 h-4 mr-2" />
      Chấp nhận lời mời
    </Button>
  );
}

export default AcceptInvitation;
