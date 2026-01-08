import React, { useLayoutEffect, useRef, useState } from "react";
import AddEventDialog from "./AddEventDialog";
import EventDetail from "./EventDetail";
import {
  calculateWeekLayout,
  formatLocalTime,
} from "@/lib/calendar";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarRow({ week, events, setEvents, calculateWeekLayout }) {
  const [rowHeight, setRowHeight] = useState(120); // Chiều cao mặc định
  const overlayRef = useRef(null);

  // useLayoutEffect giúp đo chiều cao ngay sau khi DOM thay đổi nhưng trước khi trình duyệt vẽ
  useLayoutEffect(() => {
    if (overlayRef.current) {
      // Lấy chiều cao thực tế của nội dung bên trong lớp overlay
      const contentHeight = overlayRef.current.scrollHeight;
      // + padding
      const finalHeight = Math.max(contentHeight + 40, 120); 
      setRowHeight(finalHeight);
    }
  }, [events, week])

  const weekEvents = events.filter((event) => {
    const s = new Date(event.startTime?.$date || event.startTime);
    const e = new Date(event.endTime?.$date || event.endTime);
    return s <= week[6].date && e >= week[0].date;
  });

  return (
    <div
      className="relative grid grid-cols-7 transition-[height] duration-200"
      style={{ height: `${rowHeight}px` }}
    >
      {week.map((item, index) => (
        <div key={index} className="h-full relative">
          <AddEventDialog item={item} setEvents={setEvents} />
        </div>
      ))}
      <div 
        ref={overlayRef}
        className="absolute top-8 left-0 w-full grid grid-cols-7 gap-y-1 pointer-events-none"
      >
        {weekEvents.map((event) => {
          const { startCol, span } = calculateWeekLayout(event, week); // cột bắt đầu, số ô kéo dài
          const isAllDay = (() => {
            const start = new Date(
              event.startTime?.$date || event.startTime
            );
            const end = new Date(event.endTime?.$date || event.endTime);

            const isStartOfHeader =
              start.getHours() === 0 && start.getMinutes() === 0;
            const isEndOfDay =
              (end.getHours() === 23 && end.getMinutes() === 59) ||
              (end.getHours() === 0 &&
                end.getMinutes() === 0 &&
                end.getTime() > start.getTime());

            return isStartOfHeader && isEndOfDay;
          })();

          return (
            <EventDetail
              key={event._id}
              event={event}
              setEvents={setEvents}
              trigger={
                <div
                  className="cursor-pointer pointer-events-auto h-4 text-[10px] text-white flex items-center px-2 truncate hover:text-sm"
                  style={{
                    gridColumnStart: startCol,
                    gridColumnEnd: `span ${span}`,
                    backgroundColor: event.categoryColor || "#3b82f6",
                    borderRadius: "4px",
                    zIndex: 10,
                  }}
                >
                  {isAllDay ? (
                    <p className="w-full text-center font-semibold truncate">{event.subject}</p>
                  ) : (
                    <p className="w-full flex justify-between gap-1">
                      <span className="shrink-0">{formatLocalTime(event.startTime)}</span>
                      <span className="font-semibold truncate">{event.subject}</span>
                      <span className="shrink-0">{formatLocalTime(event.endTime)}</span>
                    </p>
                  )}
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
}



function MonthViewBody({ calendar, events, setEvents }) {
  const rows = [];
  for (let i = 0; i < calendar.length; i += 7) {
    rows.push(calendar.slice(i, i + 7));
  }
  return (
    <div className="px-2 pb-5 relative w-full h-full flex flex-col">
      <div className="grid grid-cols-7 text-center font-medium shrink-0">
        {days.map((d, index) => (
          <div
            className={`col-span-1 py-2 text-white ${
              index === 0
                ? "rounded-tl-lg"
                : index === days.length - 1
                ? "rounded-tr-lg"
                : ""
            } bg-[#086280]`}
            key={d}
          >
            {d}
          </div>
        ))}
      </div>
      <div 
        className="relative border-gray-300 flex-1 grid"
        style={{ 
          gridTemplateRows: `repeat(${rows.length}, 1fr)` // Chia đều chiều cao cho mỗi hàng tuần
        }}
      >
        {rows.map((week, rowIndex) => (
          <CalendarRow 
          key={rowIndex} 
          week={week} 
          events={events} 
          setEvents={setEvents}
          calculateWeekLayout={calculateWeekLayout}
        />
        ))}
      </div>
    </div>
  );
}

export default MonthViewBody;
