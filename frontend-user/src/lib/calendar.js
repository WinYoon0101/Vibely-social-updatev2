export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getStartDayOfMonth(year, month) {
  // 0 = CN, 1 = T2 ...
  return new Date(year, month, 1).getDay();
}

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const isDateInRange = (currentDate, startDate, endDate) => {
  // Đưa tất cả về 00:00:00 để so sánh chính xác theo ngày
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Kết thúc vào cuối ngày

  const current = new Date(currentDate);
  current.setHours(0, 0, 0, 0);

  return current >= start && current <= end;
};

export const formatLocalTime = (isoString) => {
  const date = new Date(isoString);
  
  // Lấy giờ và phút, đảm bảo có số 0 đứng trước (ví dụ: 09:05)
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
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
