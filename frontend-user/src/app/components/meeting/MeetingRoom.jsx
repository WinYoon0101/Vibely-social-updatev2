"use client";

import { useState } from "react";
import {
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
} from "@stream-io/video-react-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  MessageSquare,
  Monitor,
  Phone,
  Shield,
  Smile,
  ChevronUp,
  Circle,
} from "lucide-react";

import Loader from "./Loader";
import ChatPanel from "./ChatPanel";
import ReactionAnimation from "./ReactionAnimation";
import ReactionPicker from "./ReactionPicker";
import ParticipantsList from "./ParticipantsList";

const MeetingRoom = ({ meetingId }) => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();

  const [layout, setLayout] = useState("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reactions, setReactions] = useState([]);

  const {
    useCallCallingState,
    useMicrophoneState,
    useCameraState,
    useParticipantCount,
    useScreenShareState,
    useIsCallRecordingInProgress,
  } = useCallStateHooks();

  const call = useCall();

  const callingState = useCallCallingState();
  const { microphone, isMute: isMicMuted } = useMicrophoneState();
  const { camera, isMute: isCameraMuted } = useCameraState();
  const participantCount = useParticipantCount();
  const { screenShare, status: screenShareStatus } = useScreenShareState();
  const isRecording = useIsCallRecordingInProgress();

  const isScreenSharing = screenShareStatus === "enabled";

  // Xử lý reaction
  const handleAddReaction = (emoji) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      startX: Math.random() * 80 + 10, // Random từ 10% đến 90%
    };
    setReactions((prev) => [...prev, newReaction]);
    setShowReactionPicker(false);
  };

  const handleRemoveReaction = (id) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  };

  // Chưa vào phòng thì hiển thị loading
  if (callingState !== CallingState.JOINED) return <Loader />;

  // Layout video
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  // Custom control button với icon + label (Zoom style)
  const ControlButton = ({
    icon: Icon,
    label,
    onClick,
    active = false,
    showDropdown = false,
    count = null,
    className = "",
  }) => (
    <div className="relative">
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all hover:bg-[#323B44] min-w-[74px] ${
          active ? "bg-[#ea4335] hover:bg-[#d93025]" : ""
        } ${className}`}
      >
        <div className="relative">
          <Icon size={20} className="text-white" strokeWidth={2} />
          {count !== null && count > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ea4335] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-xs text-white font-normal">{label}</span>
          {showDropdown && <ChevronUp size={12} className="text-white" />}
        </div>
      </button>
    </div>
  );

  // Leave button với style riêng
  const LeaveButton = () => (
    <button
      onClick={() => router.replace("/video-conferencing")}
      className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all bg-[#ea4335] hover:bg-[#d93025] min-w-[64px]"
    >
      <Phone size={20} className="text-white rotate-[135deg]" strokeWidth={2} />
      <span className="text-xs text-white font-normal">Kết thúc</span>
    </button>
  );

  return (
    <section className="flex flex-col h-screen w-full overflow-hidden bg-[#202124]">
      {/* Video Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div className="flex h-full w-full items-center justify-center p-4">
          <div className="flex h-full w-full max-w-[1200px] items-center">
            <CallLayout />
          </div>

          {/* Danh sách người tham gia */}
          <div
            className={`absolute right-0 top-0 h-full bg-[#1a1a1a] border-l border-[#3c4043] transition-transform duration-300 z-10 ${
              showParticipants ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ width: "340px" }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">
                  Người tham gia ({participantCount})
                </h3>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <ParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
          </div>

          {/* Chat panel */}
          <div
            className={`absolute right-0 top-0 h-full border-l border-[#3c4043] transition-transform duration-300 z-10 ${
              showChat ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ width: "340px" }}
          >
            {showChat && (
              <ChatPanel
                meetingId={meetingId}
                onClose={() => setShowChat(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Thanh điều khiển Zoom-style */}
      <div className="flex-shrink-0 bg-[#19232D] border-t border-[#3c4043]">
        <div className="flex items-center justify-between py-2 px-6">
          {/* Left section - Meeting info */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="flex items-center gap-1 px-2 py-1 bg-[#3c4043] rounded text-xs text-white/70">
              <Shield size={12} />
              <span>Bảo mật</span>
            </div>
          </div>

          {/* Center section - Main controls */}
          <div className="flex items-center gap-2">
            {/* Mic */}
            <ControlButton
              icon={isMicMuted ? MicOff : Mic}
              label={isMicMuted ? "Bật mic" : "Tắt mic"}
              onClick={() => microphone?.toggle()}
              active={isMicMuted}
              // showDropdown={true}
            />

            {/* Video */}
            <ControlButton
              icon={isCameraMuted ? VideoOff : Video}
              label={isCameraMuted ? "Bật video" : "Tắt video"}
              onClick={() => camera?.toggle()}
              active={isCameraMuted}
              // showDropdown={true}
            />

            {/* Divider */}
            <div className="w-px h-8 bg-[#3c4043] mx-1" />

            {/* Participants */}
            <ControlButton
              icon={Users}
              label="Thành viên"
              onClick={() => {
                setShowParticipants(!showParticipants);
                if (showChat) setShowChat(false);
              }}
              active={showParticipants}
              count={participantCount}
            />

            {/* Chat */}
            <ControlButton
              icon={MessageSquare}
              label="Trò chuyện"
              onClick={() => {
                setShowChat(!showChat);
                if (showParticipants) setShowParticipants(false);
              }}
              active={showChat}
            />

            {/* Share Screen */}
            <ControlButton
              icon={Monitor}
              label={isScreenSharing ? "Dừng chia sẻ" : "Chia sẻ màn hình"}
              onClick={() => screenShare?.toggle()}
              active={isScreenSharing}
            />

            {/* Record */}
            <ControlButton
              icon={Circle}
              label={isRecording ? "Dừng ghi" : "Ghi hình"}
              onClick={() =>
                isRecording ? call?.stopRecording() : call?.startRecording()
              }
              active={isRecording}
            />

            {/* Reactions */}
            <div className="relative">
              <ControlButton
                icon={Smile}
                label="Cảm xúc"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
                active={showReactionPicker}
              />
              <ReactionPicker
                isOpen={showReactionPicker}
                onSelectReaction={handleAddReaction}
              />
            </div>
          </div>

          {/* Right section - End call */}
          <div className="flex items-center gap-2 min-w-[200px] justify-end">
            <LeaveButton />
          </div>
        </div>
      </div>

      {/* Reaction Animation Overlay */}
      <ReactionAnimation
        reactions={reactions}
        onRemoveReaction={handleRemoveReaction}
      />
    </section>
  );
};

export default MeetingRoom;
