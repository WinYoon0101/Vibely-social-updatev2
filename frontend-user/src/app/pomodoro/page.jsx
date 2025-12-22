"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AiOutlineClose } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineChecklistRtl } from "react-icons/md";
import { RiPlayListLine } from "react-icons/ri";
import './pomodoro.css';
import songs from './songs';
import LeftSideBar from "../components/LeftSideBar";

const Pomodoro = () => {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Pomodoro");
  const modes = { Pomodoro: 25 * 60, "Nghỉ ngắn": 5 * 60, "Nghỉ dài": 15 * 60 };
  const [isInfoOpen,setInfoOpen] = useState(false)
  const [isListOpen,setListOpen] = useState(false)
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => {
          if (prev === 1) {
            playAlarm(); 
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const playAlarm = () => {
    const alarm = new Audio("/pomodoro.mp3"); 
    alarm.play();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };


  // Bài hát hiện tại
  const [currentIndex, setCurrentIndex] = useState(0);

  // Chuyển bài hát tiếp theo
  const handleNextSong = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
  }

  return (
    <div className="flex h-screen p-5 bg-background pt-20 justify-center lg:justify-between">
      <div className="md:hidden">
      <LeftSideBar/>
      </div>
      {/* Bên trái */}
      <Button variant="bigIcon" className="flex lg:hidden hover:bg-gray-100 absolute left-0 top-15" //Nút mở info khi mobile
        onClick={()=>{
          setInfoOpen(true)
          setListOpen(false)
        }}> 
        <IoMdInformationCircleOutline style={{width:24,height:24,color:"black"}}/>
      </Button>
      {/*Info mở ra dạng sidebar*/}
      <div className={`fixed inset-y-14 left-0 w-3/4 p-5 bg-white z-50
        transform transition-transform duration-300  ${isInfoOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:w-1/4 rounded-xl shadow-lg h-[90%] lg:h-full overflow-auto`}>   
        {/*Nút đóng info*/}   
        <Button variant="bigIcon" className="lg:hidden absolute top-4 right-4" onClick={()=>setInfoOpen(false)}> 
          <AiOutlineClose style={{width:24,height:24,color:"black"}}/>
        </Button>
        <div className="flex items-center space-x-2">
            <IoMdInformationCircleOutline size={24} />
            <p className="text-md md:text-lg font-semibold">Pomodoro là gì?</p>
        </div>
        <p className="pt-2 text-justify text-[14px]">Pomodoro có tên tiếng Anh đầy đủ là Pomodoro Technique. Phương pháp Pomodoro đã rất hữu dụng trong việc giúp tập trung, sáng tạo và giảm bớt cảm giác mệt mỏi, thậm chí là xua tan hoàn toàn đi sự uể oải. </p>
        <div className="flex items-center space-x-2 pt-4">
            <MdOutlineChecklistRtl size={24} />
            <p className="text-md md:text-lg font-semibold">Quy trình của Pomodoro</p>
        </div>
        <div className="pt-3 text-justify">
            <ul className="list-disc pl-5 text-[14px]">
                <li>Chọn một việc làm/công việc cụ thể</li>
                <li>Đặt thời gian làm việc (thường là 25 phút)</li>
                <li>Tập trung làm việc đến khi hết thời gian</li>
                <li>Nghỉ giải lao 5 phút</li>
                <li>Lặp lại quy trình và sau 4 chu kỳ, nghỉ dài hơn</li>
            </ul>
        </div>
        <img src="./images/pomodoro_method.jpeg" alt="Pomodoro Technique" className="w-full mt-5" />
      </div>

      {/* Giữa */}
      <div className="w-1/2 flex flex-col items-center my-8">
        <div className="bg-[#E0F8FE] p-10 rounded-lg shadow-lg text-center">
            <div className="flex justify-center space-x-4 mb-5">
            {Object.keys(modes).map((m) => (
                <button
                key={m}
                className={`px-4 py-2 rounded-lg font-bold sm:text-nowrap ${
                    mode === m ? "bg-[#086280] text-white" : "bg-transparent text-[#086280]"
                }`}
                onClick={() => {
                    setMode(m);
                    setTime(modes[m]);
                    setIsRunning(false);
                }}
                >
                {m}
                </button>
            ))}
            </div>
            <div className="text-7xl mt-8 font-bold text-[#086280] mb-5">{formatTime(time)}</div>
            <button
            className="px-6 mt-4 py-3 bg-[#086280] text-white font-bold text-md md:text-lg rounded-lg shadow-md hover:bg-[#07556F]"
            onClick={() => setIsRunning(!isRunning)}
            >
            {isRunning ? "DỪNG LẠI" : "BẮT ĐẦU"}
            </button>
            </div>
            {/* Trình phát nhạc */}
            <div className="w-[300px] sm:w-[350px] md:w-[400px] bg-[#086280] text-white p-4 rounded-xl shadow-lg mt-10">
            <p className="text-center text-md md:text-lg font-bold">{songs[currentIndex].name}</p>
            <p className="text-center text-xs md:text-sm opacity-80">{songs[currentIndex].singer}</p>
            <AudioPlayer
              key={songs[currentIndex].url}
              src={songs[currentIndex].url}
              autoPlay
              showJumpControls={false}
              onEnded={handleNextSong}
              className="!bg-[#086280] !rounded-lg !shadow-md"
          />
          </div>
        </div>

      {/* Bên phải */}
      <Button variant="bigIcon" className="flex lg:hidden hover:bg-gray-100 absolute right-0 top-15" //Nút mở list nhạc khi mobile
        onClick={()=>{
          setListOpen(true)
          setInfoOpen(false)
        }}> 
        <RiPlayListLine style={{width:24,height:24,color:"black"}}/>
      </Button>
      {/*List mở ra dạng sidebar*/}
      <div className={`fixed inset-y-14 right-0 w-3/4 p-5 bg-white z-50
        transform transition-transform duration-300  ${isListOpen ? "translate-x-0" : "translate-x-full"} 
        lg:translate-x-0 lg:static lg:w-1/4 rounded-xl shadow-lg h-[90%] lg:h-full overflow-auto`}>   
        {/*Nút đóng info*/}   
        <Button variant="bigIcon" className="lg:hidden absolute top-4 right-0" onClick={()=>setListOpen(false)}> 
          <AiOutlineClose style={{width:24,height:24,color:"black"}}/>
        </Button>
        <div className="flex items-center space-x-2">
            <RiPlayListLine size={24} />
            <p className="text-md lg:text-lg font-semibold">Danh sách nhạc thư giãn</p>
        </div>

        {/* Danh sách bài hát */}
        <ul className="mt-4 space-y-4">
            {songs.map((song, index) => (
            <li
                key={index}
                onClick={() => setCurrentIndex(index)} 
                className={`cursor-pointer ${currentIndex === index ? "font-bold text-blue-500" : ""}`}>
                {song.name}
                {song.singer && <span className="text-sm opacity-80"> - {song.singer}</span>}
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Pomodoro;
