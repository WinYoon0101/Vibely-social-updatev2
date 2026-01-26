"use client";

const REACTIONS = [
  { emoji: "👍", label: "Thích" },
  { emoji: "❤️", label: "Yêu thích" },
  { emoji: "😂", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Buồn" },
  { emoji: "👏", label: "Vỗ tay" },
  { emoji: "🎉", label: "Chúc mừng" },
  { emoji: "🔥", label: "Tuyệt vời" },
];

const ReactionPicker = ({ onSelectReaction, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#2d2d2d] rounded-lg shadow-2xl p-2 border border-[#3c4043]">
      <div className="flex gap-1">
        {REACTIONS.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => onSelectReaction(reaction.emoji)}
            className="w-12 h-12 flex items-center justify-center text-2xl hover:bg-[#3c4043] rounded-lg transition-all hover:scale-110 active:scale-95"
            title={reaction.label}
          >
            {reaction.emoji}
          </button>
        ))}
      </div>
      {/* Arrow pointing down */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#2d2d2d]"></div>
    </div>
  );
};

export default ReactionPicker;
