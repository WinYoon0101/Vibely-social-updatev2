"use client";

import Loader from "@/app/components/meeting/Loader";
import MeetingRoom from "@/app/components/meeting/MeetingRoom";
import MeetingSetup from "@/app/components/meeting/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallById";
import userStore from "@/store/userStore";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";

const Meeting = () => {
  const { id } = useParams();
  const user = userStore((state) => state.user);

  const { call, isCallLoading } = useGetCallById(id);

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );

  return (
    <main className="h-screen w-full bg-[#161925]">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom meetingId={id} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
//  <div className='text-[#161925] mt-20'>Meeting ID: {id}</div>;
