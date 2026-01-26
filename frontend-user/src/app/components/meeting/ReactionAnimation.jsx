"use client";

import { useEffect, useState } from "react";

const ReactionAnimation = ({ reactions, onRemoveReaction }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {reactions.map((reaction) => (
        <FloatingEmoji
          key={reaction.id}
          emoji={reaction.emoji}
          startX={reaction.startX}
          onAnimationEnd={() => onRemoveReaction(reaction.id)}
        />
      ))}
    </div>
  );
};

const FloatingEmoji = ({ emoji, startX, onAnimationEnd }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animation kéo dài 4 giây
    const timer = setTimeout(() => {
      setIsVisible(false);
      onAnimationEnd();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute bottom-0 animate-float-up"
      style={{
        left: `${startX}%`,
        fontSize: "48px",
        animationDuration: "4s",
        animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {emoji}
    </div>
  );
};

export default ReactionAnimation;
