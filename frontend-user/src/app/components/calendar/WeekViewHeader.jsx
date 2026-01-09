import { addWeeks, getStartOfWeek, getWeekDates } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDown,
  StepBack,
  StepForward,
} from "lucide-react";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

function PickDate({ date, setDate }) {
  const [open, setOpen] = useState(false);

  function formatWeekRange(date) {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();

    const startStr = start.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    });

    const endStr = end.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
    });

    return sameYear
      ? `${startStr} – ${endStr}, ${start.getFullYear()}`
      : `${startStr}, ${start.getFullYear()} – ${endStr}, ${end.getFullYear()}`;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="px-4 gap-4 w-[250px] flex items-center justify-between">
          {formatWeekRange(date)}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto max-w-md bg-white border-none shadow-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => {
            setDate(e);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function WeekViewHeader({ date, setDate }) {
  const handlePrev = () => {
    setDate(addWeeks(date, -1));
  };

  const handleNext = () => {
    setDate(addWeeks(date, 1));
  };

  return (
    <div className="flex justify-center gap-4 items-center py-2 px-4">
      <Button
        onClick={handlePrev}
        className="bg-[#086280] hover:bg-[#086280]/70 text-white"
      >
        <StepBack />
      </Button>
      <PickDate date={date} setDate={(date) => setDate(date)} />
      <Button
        onClick={handleNext}
        className="bg-[#086280] hover:bg-[#086280]/70 text-white"
      >
        <StepForward />
      </Button>
    </div>
  );
}

export default WeekViewHeader;
