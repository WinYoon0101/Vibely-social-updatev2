import { Button } from '@/components/ui/button';
import React from 'react'

function ModePicker({goToToday, mode, setMode}) {
  return (
    <div className="flex gap-2 items-center absolute right-5 top-1/2 -translate-y-1/2">
    <Button
      className="shadow-none hover:bg-gray-200"
      onClick={goToToday}
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
  )
}

export default ModePicker