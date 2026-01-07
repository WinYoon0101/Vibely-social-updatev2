export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  
  export function getStartDayOfMonth(year, month) {
    // 0 = CN, 1 = T2 ...
    return new Date(year, month, 1).getDay();
  }

  
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