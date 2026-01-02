import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRequests } from "@/service/group.service";
import { useUserGroupsStore } from "@/store/userGroupsStore";
import { Check, ChevronLeftIcon, Vote, XIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ApproveDialog({ groupInfo, refetch }) {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const {approveRequest, rejectRequest} = useUserGroupsStore()
  const fetchRequests = async () => {
    const req = await getRequests(groupInfo?._id);
    setRequests(req);
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  const approve = async (userId) => {
    try {
      await approveRequest(groupInfo?._id, userId);
      toast.success("Đã phê duyệt yêu cầu tham gia nhóm");
      fetchRequests();
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
    }
  };

  const reject = async (userId) => {
    try {
      await rejectRequest(groupInfo?._id, userId);
      toast.success("Đã từ chối yêu cầu tham gia nhóm");
      fetchRequests();
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex mt-4 font-semibold cursor-pointer hover:bg-gray-300 relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 flex items-center justify-center text-white text-xs w-4 h-4 rounded-full bg-red-500">
            {requests.length}
          </div>
          <Vote className="w-4 h-4 mr-2" />
          Phê duyệt yêu cầu
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[min(600px,80vh)] flex flex-col gap-0 py-4 sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="p-2 text-center w-full">
            Phê duyệt yêu cầu tham gia nhóm
          </DialogTitle>
          {requests.length === 0 ? (
            <div className="w-full text-gray-500 font-semibold text-center p-6">
              Không có yêu cầu tham gia nhóm nào đang chờ phê duyệt.
            </div>
          ):
          <ScrollArea className="flex max-h-full flex-col overflow-hidden py-2">
            {requests?.map((request, index) => {
              return (
                <div
                  key={index}
                  className="w-full p-2 flex justify-between items-center border-b border-gray-200"
                >
                  <div className="flex gap-2 items-center">
                    <Avatar className="!outline outline-1 outline-blue-500">
                      {requests?.profilePicture ? (
                        <AvatarImage
                          src={request?.profilePicture}
                          alt={request?.username}
                        />
                      ) : (
                        <AvatarFallback>
                          {request?.username
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <Link
                      href={`/user-profile/${request?._id}`}
                      className="text-gray-500 hover:underline"
                    >
                      {request.username}
                    </Link>
                  </div>
                  <div className="flex items-center justify-center gap-4 px-2">
                    <Button
                      className="bg-red-500 hover:bg-red-700 text-white w-8 h-8 rounded-full"
                      onClick={()=>reject(request._id)}
                    >
                      <XIcon />
                    </Button>
                    <Button
                      className="bg-[#086280] hover:bg-[#086280]/70 text-white w-8 h-8 rounded-full"
                      onClick={()=>approve(request._id)}
                    >
                      <Check />
                    </Button>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
          }
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

export default ApproveDialog;
