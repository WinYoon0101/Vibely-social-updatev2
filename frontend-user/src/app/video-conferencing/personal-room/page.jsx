"use client";

import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import userStore from "@/store/userStore";
import { useGetCallById } from "@/hooks/useGetCallById";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";


const Table = ({ title, description }) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row text-gray-600">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}:
      </h1>
      <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

const PersonalRoom = () => {
  const router = useRouter();
  const user = userStore((state) => state.user);
  const client = useStreamVideoClient();

  const meetingId = user?._id;

  const { call } = useGetCallById(meetingId || "");

  const startRoom = async () => {
    if (!client || !user || !meetingId) return;

    try {
      const newCall = client.call("default", meetingId);

      if (!call) {
        await newCall.getOrCreate({
          data: {
            starts_at: new Date().toISOString(),
          },
        });
      }

      router.push(`/video-conferencing/meeting/${meetingId}?personal=true`);
    } catch (error) {
      toast.error("Không thể tạo phòng họp");
    }
  };

  const meetingLink = meetingId
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/video-conferencing/meeting/${meetingId}?personal=true`
    : "";

  if (!user) return null;

  return (
    <section className="flex size-full flex-col gap-10 ">
      <h1 className="text-xl font-bold lg:text-3xl">
        Phòng họp cá nhân
      </h1>

      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <Table
          title="Tên phòng"
          description={`Phòng họp của ${user.username}`}
        />
        <Table title="Meeting ID" description={meetingId} />
        <Table title="Link mời" description={meetingLink} />
      </div>

      <div className="flex gap-5">
        <Button
          className="bg-[#0E78F9] text-white"
          onClick={startRoom}
          disabled={!client}
        >
          Bắt đầu cuộc họp
        </Button>

        <Button
          className="bg-[#252A41] text-white"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.success("Đã sao chép link cuộc họp!");
          }}
        >
          Sao chép link mời
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
