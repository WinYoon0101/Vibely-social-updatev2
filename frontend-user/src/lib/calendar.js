export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const formatLocalTime = (isoString) => {
  const date = new Date(isoString);

  // Lấy giờ và phút, đảm bảo có số 0 đứng trước (ví dụ: 09:05)
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  const calendar = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    calendar.push({
      date: new Date(current),
      currentMonth: current.getMonth() === month,
      year: current.getFullYear(),
    });
    current.setDate(current.getDate() + 1);
  }

  return calendar;
}

export const formatDateTime = (date) => {
  return date.toLocaleString("vi-vn", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour24: true,
  });
};
export const formatDateOnly = (date) => {
  return date.toLocaleString("vi-vn", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const getTime = (date)=>{
  return `${date
  .getHours()
  .toString()
  .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}

export const calculateWeekLayout = (event, weekDays) => {
  const start = new Date(event.startTime?.$date || event.startTime);
  const end = new Date(event.endTime?.$date || event.endTime);
  
  // Tìm ngày đầu tiên và cuối cùng của tuần này
  const weekStart = weekDays[0].date;
  const weekEnd = weekDays[6].date;

  // Vị trí cột bắt đầu (0-6)
  let startCol = 0;
  if (start > weekStart) {
    startCol = weekDays.findIndex(d => isSameDay(d.date, start));
  }

  // Vị trí cột kết thúc (0-6)
  let endCol = 6;
  if (end < weekEnd) {
    endCol = weekDays.findIndex(d => isSameDay(d.date, end));
  }

  return {
    startCol: startCol + 1, // Grid CSS bắt đầu từ 1
    span: endCol - startCol + 1
  };
};