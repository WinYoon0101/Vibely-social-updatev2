'use client';

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  
  if (!call) {
    throw new Error(
      'useStreamCall phải được sử dụng bên trong component StreamCall.',
    );
  }

  // Lấy thông tin người dùng hiện tại trong cuộc gọi
  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  // Kiểm tra có phải chủ phòng (host) hay không
  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  // Không phải host thì không hiển thị nút
  if (!isMeetingOwner) return null;

  // Kết thúc cuộc gọi cho tất cả mọi người
  const endCall = async () => {
    try {
      await call.endCall();
    } catch (error) {
      console.error('Lỗi khi kết thúc cuộc họp:', error);
    } finally {
      router.replace('/video-conferencing'); // để không back về trang trước 
    }
  };

  return (
    <Button onClick={endCall} className="bg-red-500">
      Kết thúc cuộc họp cho tất cả
    </Button>
  );
};

export default EndCallButton;
