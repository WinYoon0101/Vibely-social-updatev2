import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Canvas, useThree } from "@react-three/fiber";
import Model from "./Model";
import './rightsidebar.css';
const RightSideBar = () => {
  const [countdown, setCountdown] = useState(300);
  const [quote, setQuote] = useState("Đang tải...");
  const [author, setAuthor] = useState("Khuyết danh");
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';


  // Đếm ngược ngày thi (26/06/2025)
  useEffect(() => {
    const examDate = new Date("2026-06-11");
    const today = new Date();
    const diffTime = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    setCountdown(diffTime);
  }, []);

  // Lấy danh ngôn từ MongoDB
  useEffect(() => {
    axios.get(`${API_URL}/quotations/random`)
      .then((response) => {
        if (response.data.text) {
          setQuote(response.data.text);
          setAuthor(response.data.author || "Khuyết danh");
        } else {
          console.warn("⚠️ API không có dữ liệu hợp lệ!");
        }
      })
      .catch((error) => {
        console.error("❌ Lỗi khi gọi API:", error);
      });
  }, []);


  return (
    <aside className="w-full max-w-sm space-y-4">
      {/* Card Đếm Ngược Ngày Thi */}
      <div className="p-3 bg-white shadow-md rounded-xl text-center">
        <div className="text-base font-semibold flex justify-center items-center">
          Đếm ngược ngày thi Đại học 📢
        </div>
        <p className="text-2xl font-bold mt-2">{countdown} NGÀY</p>
        <p className="text-xs text-gray-500 mt-1">{quote} - {author}</p>
      </div>

      <div className="p-4 bg-white shadow-md rounded-xl w-full h-[170px] relative">
        <iframe
          src="https://indify.co/widgets/live/weather/qgBDva0RhZAMXiGHqmmy"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Weather Widget"
          className="absolute top-0 left-0 w-full h-full rounded-xl"
        />

      </div>
      <div className="p-4 bg-white shadow-md rounded-xl w-full h-[280px] relative">
        <Canvas>
          <directionalLight position={[-5, -5, 5]} intensity={4} />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Canvas>

      </div>


    </aside>
  );
};

export default RightSideBar;