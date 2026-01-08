import { getTime, getWeekDates, minutesFromStartOfDay } from "@/lib/calendar";
import React from "react";
import EventDetail from "./EventDetail";
import AddEventDialog from "./AddEventDialog";

const TIME_SLOT_HEIGHT = 40;

function WeekViewBody({ date, events, setEvents }) {
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${h.toString().padStart(2, "0")}:${m}`;
  });
  const weekDates = getWeekDates(date);
  return (
    <div className="px-2 pb-5 relative w-full h-full flex flex-col">
      {/* Thứ */}
      <div className="grid grid-cols-8 sticky top-0 text-white rounded-t-lg z-20 bg-[#086280]">
        <div className="col-span-1 " />
        {weekDates.map((d) => (
          <div key={d} className="text-center py-2 font-medium border-l">
            {d.toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "2-digit",
            })}
          </div>
        ))}
      </div>
      {/* Thời gian và các sự kiện */}
      <div className="grid grid-cols-8 relative">
        {/* Thời gian */}
        <div className="col-span-1">
          {timeSlots.map((t, i) => (
            <div
              key={i}
              style={{ height: TIME_SLOT_HEIGHT }}
              className="text-sm flex items-center justify-center pr-2 border-b text-gray-500 border-gray-200"
            >
              {t}
            </div>
          ))}
        </div>
        {/* 7 cột ngày */}
        {weekDates.map((day, dayIndex) => (
          <div key={dayIndex} className="relative border-l border-gray-300">
            {/* Các dòng 30 phút */}
            {timeSlots.map((t, i) => {
              const hours = Math.floor(i / 2);
              const minutes = i % 2 === 0 ? 0 : 30;
        
              const date = new Date(day);
              date.setHours(hours, minutes, 0, 0);
              const item = {                date              }
              return(
              <AddEventDialog setEvents={setEvents} key={i} isWeek={true} item={item} trigger={
                <div
                key={i}
                style={{ height: TIME_SLOT_HEIGHT }}
                className="border-b border-gray-200 hover:bg-gray-200"
              />
              } />
            )})}

            {/* Event */}
            {events.map((event) => {
              const eventStart = new Date(event.startTime);
              const eventEnd = new Date(event.endTime);

              const dayStart = startOfDay(day);
              const dayEnd = endOfDay(day);

              function startOfDay(date) {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d;
              }

              function endOfDay(date) {
                const d = new Date(date);
                d.setHours(23, 59, 59, 999);
                return d;
              }
              const renderStart = new Date(Math.max(eventStart, dayStart));
              const renderEnd = new Date(Math.min(eventEnd, dayEnd));

              if (renderStart >= renderEnd) return null;

              const top =
                (minutesFromStartOfDay(renderStart) / 30) * TIME_SLOT_HEIGHT;

              const height =
                ((renderEnd - renderStart) / (1000 * 60 * 30)) *
                TIME_SLOT_HEIGHT;

              return (
                <EventDetail
                  key={`${event._id}-${day.toDateString()}`}
                  event={event}
                  setEvents={setEvents}
                  trigger={
                    <div
                      className="absolute left-1 right-1 rounded text-white text-xs p-1 overflow-hidden"
                      style={{
                        top,
                        height,
                        backgroundColor: event.categoryColor || "#3b82f6",
                      }}
                    >
                      <p className="font-semibold truncate">{event.subject}</p>
                      <p className="opacity-90">
                        {getTime(renderStart)}
                        {" - "}
                        {getTime(renderEnd)}
                      </p>
                    </div>
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekViewBody;
