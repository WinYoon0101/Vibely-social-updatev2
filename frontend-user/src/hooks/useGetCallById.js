import { useEffect, useState } from 'react';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';

export const useGetCallById = (id) => {
  const [call, setCall] = useState(null);
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      try {
        // Truy vấn cuộc gọi theo ID
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({
          filter_conditions: { id },
        });

        // Nếu tìm thấy cuộc gọi thì lấy cuộc gọi đầu tiên
        if (calls.length > 0) {
          setCall(calls[0]);
        }

        setIsCallLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin cuộc gọi:', error);
        setIsCallLoading(false);
      }
    };

    loadCall();
  }, [client, id]);

  return {
    call,
    isCallLoading,
  };
};
