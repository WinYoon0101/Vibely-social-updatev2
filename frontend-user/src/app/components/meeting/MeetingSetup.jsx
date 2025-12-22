'use client';

import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import Alert from './Alert';
import { Button } from "@/components/ui/button";


const MeetingSetup = ({ setIsSetupComplete }) => {
  // Lấy trạng thái thời gian cuộc gọi
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();

  const callTimeNotArrived =
    callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  if (!call) {
    throw new Error(
      'useStreamCall phải được sử dụng bên trong component StreamCall.',
    );
  }

  // Bật / tắt mic & camera trước khi vào phòng
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
  if (!call) return;

  const toggleDevices = async () => {
    try {
      if (isMicCamToggled) {
        await call.camera.disable();
        await call.microphone.disable();
      } else {
        // Bật mic trước (ổn định hơn)
        await call.microphone.enable().catch(() => {
          console.warn('Không bật được microphone');
        });

        // Chỉ bật camera nếu có
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(d => d.kind === 'videoinput');

        if (hasCamera) {
          await call.camera.enable().catch(() => {
            console.warn('Không bật được camera');
          });
        }
      }
    } catch (err) {
      console.warn('Lỗi thiết bị media');
    }
  };

  toggleDevices();
}, [isMicCamToggled, call]);



  // Chưa tới giờ họp
  if (callTimeNotArrived)
    return (
      <Alert
        title={`Cuộc họp chưa bắt đầu. Lịch họp vào lúc ${callStartsAt.toLocaleString()}`}
      />
    );

  // Cuộc họp đã kết thúc
  if (callHasEnded)
    return (
      <Alert
        title="Cuộc họp đã được kết thúc bởi chủ phòng"
        iconUrl="/icons/call-ended.svg"
      />
    );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-center text-2xl font-bold">
        Thiết lập trước khi vào họp
      </h1>

      {!isMicCamToggled && <VideoPreview />}

      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Vào họp với mic và camera tắt
        </label>

        <DeviceSettings />
      </div>

      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
      >
        Tham gia cuộc họp
      </Button>
    </div>
  );
};

export default MeetingSetup;
