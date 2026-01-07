import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const months = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
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
              className={`p-2 rounded border border-1 border-transparent hover:border-[#086280] ${
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

export default PickMonth;
