'use client';

import { useEffect, useState } from 'react';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import userStore from '@/store/userStore';

/* ===== Utils: convert Date về VN ===== */
export const toVNTime = (date) => {
  if (!date) return null;
  return new Date(
    new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' })
  );
};

export const useGetCalls = () => {
  const client = useStreamVideoClient();
  const user = userStore((state) => state.user);

  const [calls, setCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?._id) return;

      setIsLoading(true);
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user._id },
              { members: { $in: [user._id] } },
            ],
          },
        });

        setCalls(calls || []);
      } catch (error) {
        console.error('Load calls error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?._id]);

  const nowVN = toVNTime(new Date());

  const endedCalls = calls.filter((call) => {
    const startsAt = toVNTime(call.state?.startsAt);
    const endedAt = call.state?.endedAt;
    return (startsAt && startsAt < nowVN) || !!endedAt;
  });

  const upcomingCalls = calls.filter((call) => {
    const startsAt = toVNTime(call.state?.startsAt);
    return startsAt && startsAt > nowVN;
  });

  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
  };
};
