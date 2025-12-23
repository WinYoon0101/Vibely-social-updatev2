"use client";
import React, { useEffect } from "react";
import LeftSideBar from "../components/LeftSideBar";
import { useUserGroupsStore } from "@/store/userGroupsStore";
import { FriendCardSkeleton, NoFriendsMessage } from "@/lib/Skeleton";
import GroupCard from "./GroupCard";
import CreateGroup from "./CreateGroup";

function Groups() {
  const {
    userGroups,
    otherGroups,
    loading,
    fetchUserGroups,
    fetchOtherGroups,
  } = useUserGroupsStore();
  useEffect(() => {
    fetchUserGroups();
    fetchOtherGroups();
  }, []);
  return (
    <div className="min-h-screen">
      <LeftSideBar />
      <main className="ml-0 md:ml-72 mt-16 p-6">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-xl font-bold mb-6">Nhóm của bạn</h1>
          <CreateGroup />
        </div>
        {loading ? (
          <FriendCardSkeleton />
        ) : userGroups.length === 0 ? (
          <NoFriendsMessage
            text="Bạn chưa tham gia nhóm nào"
            description="Hãy khám phá các nhóm và tham gia để kết nối với những người có cùng sở thích!"
          />
        ) : (
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {userGroups.map((gr) => {
              return (
                <div key={gr._id} className="col-span-1">
                  <GroupCard group={gr} myGroup={true} />
                </div>
              );
            })}
          </div>
        )}
        <h1 className="text-xl font-bold mt-8 mb-6">Có thể bạn quan tâm</h1>
        {loading ? (
          <FriendCardSkeleton />
        ) : otherGroups.length === 0 ? (
          <NoFriendsMessage
            text="Không còn nhóm nào khác để hiển thị"
            description="Bạn đã tham gia tất cả các nhóm rồi!"
          />
        ) : (
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {otherGroups.map((gr) => {
            return (
              <div key={gr._id} className="col-span-1">
                <GroupCard group={gr} />
              </div>
            );
          })}
        </div>
        )}
      </main>
    </div>
  );
}

export default Groups;
