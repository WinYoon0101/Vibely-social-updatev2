import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  StepBack,
  StepForward,
} from "lucide-react";
import React, { useState } from "react";

const months = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

function PickMonth({ date, onSelect, year, setYear }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="px-4 gap-4 flex items-center justify-center">
          <span>
            {date.getMonth() + 1}/{date.getFullYear()}
          </span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-md bg-white border-none shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <button onClick={() => setYear(year - 1)}>
            <ChevronLeft />
          </button>
          <span className="font-semibold">{year}</span>
          <button onClick={() => setYear(year + 1)}>
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((m, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(i);
                setOpen(false);
              }}
              className={`p-2 rounded border text-[0.9rem] border-1 border-transparent hover:border-[#086280] ${
                date.getMonth() === i && year === date.getFullYear()
                  ? "bg-[#086280] text-white"
                  : ""
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MonthViewHeader({ date, setDate}) {
  const [pickedYear, setPickedYear] = useState(date.getFullYear());
  const year = date.getFullYear();
  const month = date.getMonth();
  const handlePrev = () => {
    setDate(new Date(year, month - 1, 1));
  };
  const handleNext = () => {
    setDate(new Date(year, month + 1, 1));
  };
  return (
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
  );
}

export default MonthViewHeader;
