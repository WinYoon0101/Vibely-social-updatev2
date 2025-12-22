"use client";

import { useEffect } from "react";
import Image from "next/image";
import "./loader.css";

const Loader = ({ onLoad }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoad();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onLoad]);

  const sentence1 = "MẠNG XÃ HỘI HỌC TẬP KẾT NỐI CÁC BẠN TRẺ CHUNG ĐAM MÊ".split("");

  return (
    <div className="splash-screen">
      <Image src="/images/vibely_full_logo.png" alt="Logo" width={250} height={250} className="logo" />
      <h1 className="text-header">
        {sentence1.map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.05}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default Loader;
