'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Loader from './Loader';
import MeetingCard from './MeetingCard';
import { useGetCalls } from '@/hooks/useGetCalls';

/* ===== Utils: format Date theo giờ VN ===== */
const formatDateVN = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const CallList = ({ type }) => {
  const router = useRouter();
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState([]);

  

  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'upcoming':
        return upcomingCalls;
      case 'recordings':
        return recordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'Không có cuộc họp đã kết thúc';
      case 'upcoming':
        return 'Không có cuộc họp sắp diễn ra';
      case 'recordings':
        return 'Chưa có bản ghi nào';
      default:
        return '';
    }
  };

  /* ===== Lấy recordings từ calls ===== */
  useEffect(() => {
    const fetchRecordings = async () => {
      const callData = await Promise.all(
        callRecordings?.map((meeting) => meeting.queryRecordings()) ?? []
      );

      const allRecordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(allRecordings);
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isLoading) return <Loader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting) => (
          <MeetingCard
            key={meeting.id || meeting.url}
            icon={
              type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
            }
            title={
              meeting.state?.custom?.description ||
              meeting.filename?.substring(0, 20) ||
              'Không có mô tả'
            }
            date={
              type === 'recordings'
                ? formatDateVN(meeting.start_time)
                : formatDateVN(meeting.state?.startsAt)
            }
            isPreviousMeeting={type === 'ended'}
            link={
              type === 'recordings'
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/video-conferencing/meeting/${meeting.id}`
            }
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Xem lại' : 'Vào họp'}
            handleClick={
              type === 'recordings'
                ? () => window.open(meeting.url, '_blank')
                : () => router.push(`/video-conferencing/meeting/${meeting.id}`)
            }
          />
        ))
      ) : (
        <h1 className="text-2xl font-bold text-gray-500 ">{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
