//import React from "react";
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileHeader from "../ProfileHeader";
import ProfileTabs from "../ProfileTabs";
import { fetchUserProfile } from "@/service/user.service";
import LeftSideBar from "@/app/components/LeftSideBar";

const Page = () => {
  const params = useParams();
  const id = params.id;
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const result = await fetchUserProfile(id);
      setProfileData(result.profile);
      setIsOwner(result.isOwner);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (!profileData) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <div className="md:hidden">
        <LeftSideBar/>
      </div>
      <ProfileHeader
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
      <ProfileTabs
        profileData={profileData}
        setProfileData={setProfileData}
        isOwner={isOwner}
        id={id}
        fetchProfile={fetchProfile}
      />
    </div>
  );
};

export default Page;
