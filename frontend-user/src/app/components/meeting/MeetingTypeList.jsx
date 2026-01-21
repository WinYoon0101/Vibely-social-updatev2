'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import Loader from './Loader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import userStore from '@/store/userStore';
import { toast } from 'react-hot-toast';

/* ===== Utils ===== */
const initialValues = {
  dateTime: new Date(),
  description: '',
  link: '',
};

const MeetingTypeList = () => {
  const router = useRouter();
  const client = useStreamVideoClient();
  const user = userStore((state) => state.user);

  const [meetingState, setMeetingState] = useState();
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState();

  if (!client || !user) return <Loader />;

  /* ===== Tạo cuộc họp ===== */
  const createMeeting = async () => {
    if (!values.dateTime) {
      toast.error('Vui lòng chọn ngày và giờ');
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Không thể tạo cuộc họp');

      await call.getOrCreate({
        data: {
          starts_at: values.dateTime, // giữ Date object
          custom: {
            description: values.description || 'Cuộc họp mới',
            timezone: 'Asia/Ho_Chi_Minh',
          },
        },
        members: [user._id], // thêm chính bạn vào members
      });

      setCallDetail(call);

      if (!values.description) {
        router.push(`/video-conferencing/meeting/${call.id}`);
      }

      toast.success('Tạo cuộc họp thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Tạo cuộc họp thất bại!');
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/video-conferencing/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

      <HomeCard
        img="/icons/add-meeting.svg"
        title="Tạo cuộc họp mới"
        description="Bắt đầu cuộc họp ngay"
        className="bg-[#FF742E]"
        handleClick={() => setMeetingState('isInstantMeeting')}
      />

      <HomeCard
        img="/icons/join-meeting.svg"
        title="Tham gia cuộc họp"
        description="Qua liên kết mời"
        className="bg-[#0E78F9]"
        handleClick={() => setMeetingState('isJoiningMeeting')}
      />

      <HomeCard
        img="/icons/schedule.svg"
        title="Lên lịch họp"
        description="Lên kế hoạch cuộc họp"
        className="bg-[#830EF9]"
        handleClick={() => setMeetingState('isScheduleMeeting')}
      />

      <HomeCard
        img="/icons/recordings.svg"
        title="Bản ghi"
        description="Xem lại cuộc họp"
        className="bg-[#F9A90E]"
        handleClick={() => router.push('/video-conferencing/recordings')}
      />

      {/* Instant meeting */}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Bắt đầu cuộc họp ngay"
        buttonText="Bắt đầu cuộc họp"
        handleClick={createMeeting}
      />

      {/* Schedule meeting */}
      {!callDetail ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Tạo cuộc họp"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-[#ECF0FF]">Thêm mô tả</label>
            <Textarea
              placeholder="Nhập mô tả cuộc họp"
              className="border-none bg-[#252A41] focus-visible:ring-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-base text-[#ECF0FF]">Chọn ngày và giờ</label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Giờ"
              dateFormat="dd/MM/yyyy HH:mm"
              className="w-full rounded bg-[#252A41] p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Tạo cuộc họp thành công"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast.success('Đã sao chép link cuộc họp!');
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Sao chép link cuộc họp"
        />
      )}

      {/* Join meeting */}
      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Nhập link cuộc họp"
        buttonText="Tham gia cuộc họp"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Dán link cuộc họp vào đây"
          className="border-none bg-[#252A41] focus-visible:ring-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>

    </section>
  );
};

export default MeetingTypeList;
