import React from "react";
import EditGroupDialog from "./EditGroupDialog";
import LeaveGroup from "./LeaveGroup";
import ApproveDialog from "./ApproveDialog";
import AcceptInvitation from "./AcceptInvitation";
import InviteFriends from "./InviteFriends";

function GroupHeader({ info, refetch, isAdmin, isMember, isCreator }) {
  return (
    <div className="relative">
      <div className="h-64 md:h-80 bg-gray-300 overflow-hidden ">
        <img
          src={info?.coverPhotoUrl || "/about/image_2.jpg"}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 md:mt-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-5 ">
          <div className="mt-4 md:mt-0 text-center md:text-left flex-grow space-y-2">
            <h1 className="text-3xl font-bold">{info?.name}</h1>
            <p className="text-gray-400 font-semibold">
              {info?.privacySetting === "private"
                ? "Nhóm riêng tư"
                : "Nhóm công khai"}
              &nbsp;·&nbsp;{info?.members.length} thành viên
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col space-y-2">
            {!isMember && <AcceptInvitation groupId={info?._id} refetch={refetch} />}
            {isMember && <InviteFriends groupId={info?._id}/>}
            {!isCreator && isMember && <LeaveGroup groupId={info?._id} />}
            </div>
            
          </div>
          {isAdmin && (
            <div className="flex flex-col space-y-2">
              <EditGroupDialog groupInfo={info} refetch={refetch} />
              <ApproveDialog groupInfo={info} refetch={refetch} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupHeader;
