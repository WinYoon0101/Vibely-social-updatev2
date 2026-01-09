import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Canvas, useThree } from "@react-three/fiber";
import Model from "./Model";
import "./rightsidebar.css";
import { getNextEvent } from "@/service/calendar.service";
import { formatDateTime } from "@/lib/calendar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const RightSideBar = () => {
  const [countdown, setCountdown] = useState(300);
  const [quote, setQuote] = useState("Đang tải...");
  const [author, setAuthor] = useState("Khuyết danh");
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";
  const [nextEvent, setNextEvent] = useState(null);

  const fetchQuote = async () => {
    try {
      const response = await axios.get(`${API_URL}/quotations/random`);
      if (response.data.text) {
        setQuote(response.data.text);
        setAuthor(response.data.author || "Khuyết danh");
      } else {
        console.warn("⚠️ API không có dữ liệu hợp lệ!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
    }
  };

  const fetchNextEvent = async () => {
    try {
      const res = await getNextEvent();
      if (res && res._id) {
        setNextEvent(res);
      } else {
        setNextEvent(null);
      }
    } catch (error) {
      console.error("Không lấy được sự kiện tiếp theo:", error);
    }
  };

  useEffect(() => {
    const examDate = new Date("2026-06-11");
    const today = new Date();
    const diffTime = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    setCountdown(diffTime);
    fetchQuote();
    fetchNextEvent()
  }, []);

  return (
    <aside className="w-full max-w-sm space-y-4">
      {/* Card Đếm Ngược Ngày Thi */}
      <div className="p-3 bg-white shadow-md rounded-xl text-center">
        <div className="text-base font-semibold flex justify-center items-center">
          Đếm ngược ngày thi Đại học 📢
        </div>
        <p className="text-2xl font-bold mt-2">{countdown} NGÀY</p>
        <p className="text-xs text-gray-500 mt-1">
          {quote} - {author}
        </p>
      </div>

      <div className="p-4 bg-white shadow-md rounded-xl w-full h-[200px] relative">
        <iframe
          src="https://indify.co/widgets/live/weather/Obn6at5MNLLwncoOxiSR"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Weather Widget"
          className="absolute top-0 left-0 w-full h-full rounded-xl"
        />
      </div>
      <div className="p-4 bg-white shadow-md flex flex-col rounded-xl w-full h-[200px] relative">
        {/* <Canvas>
          <directionalLight position={[-5, -5, 5]} intensity={4} />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Canvas> */}

          <h1 className="text-base font-semibold text-center">
          Sự kiện hiện tại & sắp tới 📆
          </h1>
          {nextEvent ? (
            <Link href="/calendar" className="flex-1 flex flex-col rounded-lg m-2 border border-1 hover:scale-[1.1] cursor-pointer" style={{borderColor:nextEvent?.categoryColor,backgroundColor : nextEvent?.categoryColor}}>
              <div className="text-white h-1/3 flex items-center justify-center text-[1.1rem] font-semibold">{nextEvent?.subject}</div>
              <div className="bg-white flex flex-col items-center justify-center text-gray-700 font-semibold rounded-b-lg flex-1">
                <p className="text-sm">Bắt đầu: {formatDateTime(new Date(nextEvent?.startTime))}</p>
                <p className="text-sm">Kết thúc: {formatDateTime(new Date(nextEvent?.endTime))}</p>
              </div>
            </Link>
          ) : (
            <div className="flex-1 gap-2 flex flex-col items-center text-center justify-center text-gray-500">
              Bạn không có sự kiện nào đang diễn ra hoặc sắp tới cả!
              <Link href="/calendar">
              <Button className="bg-[#086280] hover:bg-[#086280]/70 text-white">
                Tạo sự kiện mới
              </Button></Link>
            </div>
          )}
        </div>
     
    </aside>
  );
};

export default RightSideBar;
