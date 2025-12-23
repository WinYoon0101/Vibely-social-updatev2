"use client"
import LeftSideBar from '@/app/components/LeftSideBar';
import { useParams } from 'next/navigation'
import { getGroupById } from "@/service/group.service";
import userStore from "@/store/userStore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GroupHeader from '../GroupHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupTabContent from '../GroupTabContent';

function Group() {
  const groupId = useParams().id;
  const [groupInfo, setInfo] = useState(null);
  const user = userStore((state) => state.user);

  const fetchGroupInfo = async (groupId) => {
    try {
      const res = await getGroupById(groupId);
      setInfo(res);
    } catch (error) {
      toast.error("Không thể lấy thông tin nhóm");
      console.log(error.message);
    }
  };
  const isAdmin = groupInfo?.admins.find((admin) => admin._id === user._id);
  const isCreator = groupInfo?.createdBy._id === user._id;
  useEffect(() => {
    fetchGroupInfo(groupId);
  }, []);

  const [activeTab, setActiveTab] = useState("posts");
  return (
    <div>
      <div className="md:hidden">
        <LeftSideBar/>
      </div>
      <GroupHeader info={groupInfo} isAdmin={isAdmin} isCreator={isCreator}/>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t border-gray-200 dark:border-gray-700 pt-1">
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full md:w-1/2 grid-cols-4">
          <TabsTrigger value="intro" className="data-[state=active]:text-[#086280]">Giới thiệu</TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:text-[#086280]">Bài viết</TabsTrigger>
          <TabsTrigger value="member" className="data-[state=active]:text-[#086280]">Thành viên</TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:text-[#086280]">File phương tiện</TabsTrigger>
        </TabsList>

        <div className='mt-6'>
          <GroupTabContent />
        </div>
      </Tabs>
    </div>
    </div>
  )
}

export default Group