import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import userStore from "@/store/userStore";
import Link from "next/link";
import React, { useState } from "react";
import GroupPosts from "./GroupPosts";
import GroupMedia from "./GroupMedia";
import AdminCard from "./AdminCard";
import MemberCard from "./MemberCard";

function GroupTabContent({ activeTab, groupInfo, refetch, isAdmin, isCreator }) {
  const [query, setQuery] = useState("");
  const { user } = userStore((state) => state);
  const isMember = groupInfo?.members.find((member) => member._id === user._id);
  const filteredMembers = groupInfo?.members.filter((member) =>
    member.username.toLowerCase().includes(query.toLowerCase())
  );
  const tabContent = {
    intro: (
      <Card className="p-4 bg-white rounded-lg border-0 shadow-lg w-full md:max-w-4xl mb-10">
        <CardHeader className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-20">
          <div className="col-span-1 flex flex-col gap-6">
            <Label className="flex flex-col gap-4">
              <h2 className="text-[1.1rem] font-semibold">Tên nhóm</h2>
              <p className="text-gray-500">{groupInfo?.name}</p>
            </Label>
            <Label className="flex flex-col gap-4">
              <h2 className="text-[1.1rem] font-semibold">Mô tả nhóm</h2>
              <p className="text-gray-500 leading-[1.5]">
                {groupInfo?.description || (
                  <span className="italic">Chưa có mô tả về nhóm.</span>
                )}
              </p>
            </Label>
          </div>
          <div className="col-span-1 flex flex-col gap-6">
            <Label className="flex flex-col gap-4">
              <h2 className="text-[1.1rem] font-semibold">Chế độ nhóm</h2>
              <p className="text-gray-500">
                {groupInfo?.privacySetting === "private"
                  ? "Riêng tư"
                  : "Công khai"}
              </p>
            </Label>
            <Label className="flex flex-col gap-4">
              <h2 className="text-[1.1rem] font-semibold">
                Số lượng thành viên
              </h2>
              <p className="text-gray-500">{groupInfo?.members.length}</p>
            </Label>
            <Label className="flex flex-col gap-4">
              <h2 className="text-[1.1rem] font-semibold">Được tạo bởi</h2>
              <div className="flex gap-2 items-center">
                <Avatar className="!outline outline-1 outline-blue-500">
                  {groupInfo?.createdBy?.profilePicture ? (
                    <AvatarImage
                      src={groupInfo?.createdBy?.profilePicture}
                      alt={groupInfo?.createdBy?.username}
                    />
                  ) : (
                    <AvatarFallback>
                      {groupInfo?.createdBy?.username
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Link
                  href={`/user-profile/${groupInfo?.createdBy?._id}`}
                  className="text-gray-500 hover:underline"
                >
                  {groupInfo?.createdBy.username}
                </Link>
              </div>
            </Label>
          </div>
        </CardHeader>
      </Card>
    ),
    posts: (
      <div className="w-full mx-auto max-w-2xl">
        {!isMember && groupInfo?.privacySetting === "private" ? (
          <div>Bạn phải là thành viên của nhóm để xem bài viết.</div>
        ) : (
          <div className="flex">
            <GroupPosts groupInfo={groupInfo} />
          </div>
        )}
      </div>
    ),
    members: (
      <Card className="p-4 bg-white rounded-lg border-0 shadow-lg w-full md:max-w-4xl mb-10">
        <CardHeader className="w-full flex flex-col gap-2">
          <h2 className="text-[1.2rem] font-semibold mb-4">Người sáng lập</h2>
          <div className="flex gap-2 items-center">
            <Avatar className="!outline outline-1 outline-blue-500">
              {groupInfo?.createdBy?.profilePicture ? (
                <AvatarImage
                  src={groupInfo?.createdBy?.profilePicture}
                  alt={groupInfo?.createdBy?.username}
                />
              ) : (
                <AvatarFallback>
                  {groupInfo?.createdBy?.username
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
            <Link
              href={`/user-profile/${groupInfo?.createdBy?._id}`}
              className="text-gray-500 hover:underline"
            >
              {groupInfo?.createdBy.username}
            </Link>
          </div>
          <h2 className="text-[1.2rem] font-semibold my-5">Quản trị viên</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
            {groupInfo?.admins.map((admin) => {
              return <AdminCard key={admin._id} admin={admin} isAdmin={isAdmin} info={groupInfo} refetch={refetch}/>;
            })}
          </div>
          <div className="w-full flex justify-between items-center mt-5">
            <h2 className="text-[1.2rem] font-semibold mb-4 ">
              Thành viên nhóm
            </h2>
            <div
              className={`flex items-center gap-x-2 md:gap-x-5 w-1/2 ${
                !isMember && groupInfo?.privacySetting === "private"
                  ? "hidden"
                  : ""
              }`}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm thành viên..."
                className="w-full border px-4 py-2 bg-white rounded-md focus:outline-none italic focus:ring-2 focus:ring-blue-400 border-gray-300"
                onKeyDown={(e) => e.key === "Enter"}
              />
            </div>
          </div>
          {!isMember && groupInfo?.privacySetting === "private" ? (
            <div className="text-center text-gray-500 font-semibold">
              Bạn phải là thành viên của nhóm để xem danh sách thành viên.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
              {query !== ""
                ? filteredMembers.map((member) => {
                    return <MemberCard key={member._id} member={member} isAdmin={isAdmin} info={groupInfo} refetch={refetch}/>;
                  })
                : groupInfo?.members.map((member) => {
                    return <MemberCard key={member._id} member={member} isAdmin={isAdmin} info={groupInfo} refetch={refetch} />;
                  })}
            </div>
          )}
        </CardHeader>
      </Card>
    ),
    files: (
      <div className="w-full mx-auto max-w-6xl">
        {!isMember && groupInfo?.privacySetting === "private" ? (
          <div>Bạn phải là thành viên của nhóm để xem bài viết.</div>
        ) : (
          <div>
            <GroupMedia groupInfo={groupInfo} />
          </div>
        )}
      </div>
    ),
  };
  return (
    <div className="flex flex-col items-center">
      {tabContent[activeTab] || null}
    </div>
  );
}

export default GroupTabContent;
