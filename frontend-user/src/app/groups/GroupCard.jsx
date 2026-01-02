import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Clock } from "lucide-react";
import Link from "next/link";
import JoinGroupDialog from "./JoinGroupDialog";
import userStore from "@/store/userStore";

function GroupCard({ group, myGroup = false }) {
  const { user } = userStore();
  return (
    <div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white mb-4 p-4 shadow rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg"
    >
      <img
        src={group?.coverPhotoUrl}
        alt={group.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <Link href={`/groups/${group._id}`} className="block">
        <h3 className="text-lg font-semibold mb-2 hover:underline truncate">
          {group.name}
        </h3>
      </Link>

      <p className="text-sm mb-4 h-4 truncate">
        {group.description ? group.description : " "}
      </p>
      <div className="flex flex-col justify-between w-full">
        {myGroup ? (
          <Link href={`/groups/${group._id}`}>
            <Button
              className="w-full flex gap-2 items-center bg-[#086280] hover:bg-[#086280]/70 text-white"
              size="lg"
            >
              <Eye className="mr-2 h-4 w-4" /> Xem nhóm
            </Button>
          </Link>
        ) : !group?.waitingRequests?.includes(user._id) ? (
          <JoinGroupDialog group={group} />
        ) : (
          <Button className="bg-[#086280]/60 text-white" disabled={true} size="lg">
            <Clock className="mr-2 h-4 w-4" /> Đang chờ phê duyệt
          </Button>
        )}
      </div>
    </div>
  );
}

export default GroupCard;
