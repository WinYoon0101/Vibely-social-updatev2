'use client';

import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';


import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { DropdownMenu,
    DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();

  const [layout, setLayout] = useState('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  // Chưa vào phòng thì hiển thị loading
  if (callingState !== CallingState.JOINED) return <Loader />;

  // Layout video
  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="flex h-full w-full max-w-[1000px] items-center">
          <CallLayout />
        </div>

        {/* Danh sách người tham gia */}
        <div
          className={`ml-2 h-[calc(100vh-86px)] ${
            showParticipants ? 'block' : 'hidden'
          }`}
        >
          <CallParticipantsList
            onClose={() => setShowParticipants(false)}
          />
        </div>
      </div>

      {/* Thanh điều khiển */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.replace('/video-conferencing')} />

        {/* Chọn layout */}
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {[
              { label: 'Lưới', value: 'grid' },
              { label: 'Diễn giả (trái)', value: 'speaker-left' },
              { label: 'Diễn giả (phải)', value: 'speaker-right' },
            ].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem onClick={() => setLayout(item.value)}>
                  {item.label}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        {/* Toggle danh sách người tham gia */}
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {/* Chỉ host mới được kết thúc cuộc gọi */}
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
