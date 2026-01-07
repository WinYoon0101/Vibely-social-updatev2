"use client";
import AddEventDialog from "@/app/components/calendar/AddEventDialog";
import PickMonth from "@/app/components/calendar/PickMonth";
import { Button } from "@/components/ui/button";
import { generateCalendar } from "@/lib/calendar";
import { StepBack, StepForward } from "lucide-react";
import { useEffect, useState } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("❌ Không tìm thấy token");
                    return;
                }

                const response = await fetch(`${API_URL}/schedules`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Lỗi lấy dữ liệu");

                const result = await response.json();

                const data = Array.isArray(result.data) ? result.data : [];
                setEvents(data);
            } catch (error) {
                console.error("Lỗi khi lấy lịch trình:", error);
            }
        };
        fetchSchedules();
    }, []);
  const [mode, setMode] = useState("month"); // "day", "week", "month"
  const [date, setDate] = useState(new Date());
  const today = new Date();

  const [pickedYear, setPickedYear] = useState(date.getFullYear());
  const year = date.getFullYear();
  const month = date.getMonth();

  const calendar = generateCalendar(year, month);
  const handlePrev = () => {
    if (mode === "month") {
      setDate(new Date(year, month - 1, 1));
    }
  };
  const handleNext = () => {
    if (mode === "month") {
      setDate(new Date(year, month + 1, 1));
    }
  };

  return (
    <main className="pt-14">
      {/*Header*/}
      <div className="flex justify-between md:justify-center gap-4 items-center py-2 px-4 relative">
        <div className="flex justify-center gap-4 items-center py-2 px-4">
          <Button
            onClick={handlePrev}
            className="bg-[#086280] hover:bg-[#086280]/70 text-white"
          >
            <StepBack />
          </Button>
          <PickMonth
            date={date}
            year={pickedYear}
            setYear={setPickedYear}
            onSelect={(month) => setDate(new Date(pickedYear, month, 1))}
          />
          <Button
            onClick={handleNext}
            className="bg-[#086280] hover:bg-[#086280]/70 text-white"
          >
            <StepForward />
          </Button>
        </div>
        <div className="flex gap-2 items-center absolute right-5 top-1/2 -translate-y-1/2">
          <Button
            className="shadow-none hover:bg-gray-200"
            onClick={() => {
              setDate(today);
            }}
          >
            Hôm nay
          </Button>
          <span>|</span>
          <Button
            className={`shadow-none hover:bg-gray-200 hover:text-black ${
              mode === "day" ? "bg-[#086280] text-white" : ""
            }`}
            onClick={() => {
              setMode("day");
            }}
          >
            Ngày
          </Button>
          <Button
            className={`shadow-none hover:bg-gray-200 hover:text-black ${
              mode === "week" ? "bg-[#086280] text-white" : ""
            }`}
            onClick={() => {
              setMode("week");
            }}
          >
            Tuần
          </Button>
          <Button
            className={`shadow-none hover:bg-gray-200 hover:text-black ${
              mode === "month" ? "bg-[#086280] text-white" : ""
            }`}
            onClick={() => {
              setMode("month");
            }}
          >
            Tháng
          </Button>
        </div>
      </div>
      {mode === "month" && (
        <>
          {/*Thứ*/}
          <div className="grid grid-cols-7 text-center font-medium">
            {days.map((d) => (
              <div className="col-span-1 py-2 text-white bg-[#086280]" key={d}>
                {d}
              </div>
            ))}
          </div>
          {/*Ngày*/}
          <div className="grid grid-cols-7 gap-1 bg-gray-100">
            {calendar.map((item, index) => {
                return(
              <div
                key={index}
                className={`relative p-2 text-left cursor-pointer rounded col-span-1 aspect-video border border-1 border-gray-300 hover:border-blue-500 hover:border-2
                  ${
                    item.currentMonth ? "bg-white" : "bg-gray-100 text-gray-400"
                  }
                
                `}
              >
                <span
                  className={`
                        rounded-full w-7 h-7 inline-flex items-center justify-center ${
                          item.date.getDate() === today.getDate() &&
                          item.date.getMonth() === today.getMonth() &&
                          item.date.getFullYear() === today.getFullYear()
                            ? "font-bold text-white bg-[#086280]"
                            : "bg-transparent"
                        }`}
                >
                  {item.date.getDate()}
                </span>
                <div className="absolute top-1 right-1">
                  <AddEventDialog setEvents={setEvents} date={item.date}/>
                </div>
              </div>
            )})}
          </div>
        </>
      )}
    </main>
  );
};

export default Calendar;
