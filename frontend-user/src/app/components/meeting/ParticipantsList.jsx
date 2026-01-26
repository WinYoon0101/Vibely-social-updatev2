"use client";

import {
  hasAudio,
  hasVideo,
  hasScreenShare,
  hasScreenShareAudio,
  hasPausedTrack,
  isPinned,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { Users, Mic, MicOff, Video, VideoOff, Monitor } from "lucide-react";

const ParticipantsList = ({ onClose }) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      <div className="flex-1 overflow-y-auto">
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/50">
            <Users size={48} className="mb-2" />
            <p className="text-sm">Chưa có người tham gia</p>
          </div>
        ) : (
          <div className="space-y-2">
            {participants.map((participant) => {
              /** ✅ Trạng thái media (CHUẨN SDK) */
              const audioOn = hasAudio(participant);
              const videoOn = hasVideo(participant);
              const screenShareOn = hasScreenShare(participant);
              const screenShareAudioOn =
                hasScreenShareAudio(participant);
              const videoPaused = hasPausedTrack(
                participant,
                "videoTrack"
              );
              const pinned = isPinned(participant);

              const isLocal = participant.isLocalParticipant;

              /** ✅ Xác định role */
              let role = "Thành viên";
              if (participant.roles?.includes("host")) {
                role = "Chủ phòng";
              } else if (participant.roles?.includes("admin")) {
                role = "Quản trị viên";
              }

              return (
                <div
                  key={participant.sessionId}
                  className="flex items-center gap-3 p-3 hover:bg-[#2d2d2d] rounded-lg transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {participant.image ? (
                      <img
                        src={participant.image}
                        alt={participant.name || participant.userId}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#5f9eff] flex items-center justify-center text-white font-semibold">
                        {(participant.name ||
                          participant.userId ||
                          "U")[0].toUpperCase()}
                      </div>
                    )}

                    {pinned && (
                      <span className="absolute -top-1 -right-1 text-xs bg-yellow-500 text-black px-1 rounded">
                        📌
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium truncate">
                        {participant.name || participant.userId}
                      </p>
                      {isLocal && (
                        <span className="text-xs text-white/50">
                          (Bạn)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50">{role}</p>
                  </div>

                  {/* Media status */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Mic */}
                    {audioOn ? (
                      <div className="p-1.5 rounded bg-[#34a853]/20">
                        <Mic size={14} className="text-[#34a853]" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded bg-[#ea4335]/20">
                        <MicOff size={14} className="text-[#ea4335]" />
                      </div>
                    )}

                    {/* Camera */}
                    {videoOn && !videoPaused ? (
                      <div className="p-1.5 rounded bg-[#34a853]/20">
                        <Video size={14} className="text-[#34a853]" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded bg-[#ea4335]/20">
                        <VideoOff
                          size={14}
                          className="text-[#ea4335]"
                        />
                      </div>
                    )}

                    {/* Screen share */}
                    {screenShareOn && (
                      <div className="p-1.5 rounded bg-blue-500/20">
                        <Monitor size={14} className="text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsList;