"use client";
import ModePicker from "@/app/components/calendar/ModePicker";
import MonthViewBody from "@/app/components/calendar/MonthViewBody";
import MonthViewHeader from "@/app/components/calendar/MonthViewHeader";
import WeekViewBody from "@/app/components/calendar/WeekViewBody";
import WeekViewHeader from "@/app/components/calendar/WeekViewHeader";
import { getEvents } from "@/service/calendar.service";
import { useEffect, useState } from "react";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Không tìm thấy token");
          return;
        }
        const evts = await getEvents()
        const data = Array.isArray(evts) ? evts : [];
        setEvents(data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch trình:", error);
      }
    };
    fetchSchedules();
  }, []);
  const [mode, setMode] = useState("week"); // "day", "week", "month"
  const [date, setDate] = useState(new Date());

  return (
    <main className="pt-14">
      {/*Header*/}
      <div className="flex justify-between md:justify-center gap-4 items-center py-2 px-4 relative">
        {mode === "month" && (
          <MonthViewHeader
            date={date}
            setDate={setDate}
          />
        )}
        {mode === "week" && (
          <WeekViewHeader date={date} setDate={setDate} />
        )}
        {/*Chọn chế độ xem lịch (ngày, tuần, tháng) */}
       <ModePicker mode={mode} setMode={setMode} goToToday={()=>setDate(new Date())}/>
      </div>
      {mode === "month" && (
        <MonthViewBody date={date} events={events} setEvents={setEvents} />
      )}
      {mode === "week" && (
        <WeekViewBody date={date} events={events} setEvents={setEvents} />
      )}
    </main>
  );
};

export default Calendar;
