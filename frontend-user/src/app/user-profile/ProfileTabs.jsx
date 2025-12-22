"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { ProfileDetails } from "./ProfileDetails";


const ProfileTabs = ({ id,
  profileData,
  isOwner,
  setProfileData,
  fetchProfile,
}) => {
  const [activeTab, setActiveTab] = useState("posts");
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-t border-gray-200 dark:border-gray-700 pt-1">
      <Tabs
        defaultValue="posts"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full md:w-1/2 grid-cols-5">
          <TabsTrigger value="posts" className="data-[state=active]:text-[#086280] post-tab">Bài viết</TabsTrigger>
          <TabsTrigger value="photos" className="data-[state=active]:text-[#086280] image-tab">Ảnh</TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:text-[#086280] video-tab">Video</TabsTrigger>
          <TabsTrigger value="friends" className="data-[state=active]:text-[#086280] friend-tab">Bạn bè</TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:text-[#086280] document-tab">Tài liệu</TabsTrigger>
        </TabsList>

        <div className='mt-6'>
          <ProfileDetails
            activeTab={activeTab}
            profileData={profileData}
            id={id}
            isOwner={isOwner}
            setProfileData={setProfileData}
            fetchProfile={fetchProfile}
          />
        </div>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
