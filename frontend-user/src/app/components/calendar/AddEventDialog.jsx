import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import PickColorCombobox from "./PickColorCombobox";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

function AddEventDialog({ setEvents, date }) {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#2563EB");
  const [startTime, setStartTime] = useState(new Date(date));
  const [endTime, setEndTime] = useState(() => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + 30);
    return d;
  });
  useEffect(() => {
    setStartTime(new Date(date));
    setEndTime(() => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() + 30);
      return d;
    });
  }, [date]);
  const [allDay, setAllDay] = useState(false);
  const handleAddEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Không tìm thấy token");
        return;
      }
      if (!title) {
        toast.error("Vui lòng nhập tiêu đề sự kiện");
        return;
      }
      if (endTime <= startTime) {
        toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
        return;
      }
      const response = await fetch(`${API_URL}/schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: title,
          startTime: startTime,
          endTime: endTime,
          categoryColor: color || "#2563EB",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setEvents((prev) => [...prev, { ...prev, Id: result.data._id }]);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (allDay) {
      // Start: 00:00
      const start = new Date(startTime);
      start.setHours(0, 0, 0, 0);

      // End: 23:59
      const end = new Date(startTime);
      end.setHours(23, 59, 0, 0);

      setStartTime(start);
      setEndTime(end);
    }
  }, [allDay]);
  const formatDateTime = (date) => {
    return date.toLocaleString("vi-vn", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour24: true,
    });
  };
  const formatDateOnly = (date) => {
    return date.toLocaleString("vi-vn", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const totalMinutes = i * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });
  const selectedStartTime = `${startTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${startTime.getMinutes().toString().padStart(2, "0")}`;
  const selectedEndTime = `${endTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="p-2 shadow-none hover:bg-gray-200"
          title="Thêm sự kiện mới"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-lg bg-white"
        // Chặn chỉ có thể đóng khi bấm DialogClose
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className={"flex flex-col gap-2"}>
          <DialogTitle>Sự kiện mới</DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full items-center gap-4">
            <div className="col-span-1 flex flex-col">
              <Label htmlFor={"title"} className="gap-1">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id={"title"}
                type="text"
                placeholder="Tiêu đề sự kiện"
                required
                className="
              rounded-none
              border-0
              border-b
              border-b-gray-300
              focus:border-b-2
              focus:border-[#086280]
              focus:outline-none
            "
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="col-span-1 flex flex-col">
              <Label htmlFor={"color"} className="gap-1">
                Màu sắc
              </Label>
              <PickColorCombobox value={color} setValue={setColor} />
            </div>
            <div className="col-span-1 flex flex-col">
              <Label htmlFor={"start"} className="gap-1">
                Bắt đầu lúc <span className="text-red-500">*</span>
              </Label>
              <div className="w-full flex items-center border-b border-gray-400 focus-within:border-[#086280]">
                <input
                  readOnly
                  value={
                    allDay
                      ? formatDateOnly(startTime)
                      : formatDateTime(startTime)
                  }
                  className="flex-1 min-w-0 py-2 outline-none bg-transparent truncate"
                />

                {/* Date button */}
                <Popover open={open1} onOpenChange={setOpen1} side="right">
                  <PopoverTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-[#086280]">
                      <CalendarIcon />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="flex p-0 w-auto bg-white">
                    <Calendar
                      mode="single"
                      className={"rounded-md"}
                      selected={startTime}
                      onSelect={(date) => {
                        if (!date) return;
                        const newDate = new Date(startTime);
                        newDate.setFullYear(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate()
                        );
                        setStartTime(newDate);
                      }}
                      initialFocus
                    />

                    {!allDay && (
                      <ScrollArea
                        className="rounded-md max-h-[300px] w-[100px]"
                        onWheel={
                          (e) => e.stopPropagation()
                          // Ngăn sự kiện cuộn bị Dialog bắt mất
                        }
                      >
                        <div className="flex flex-col items-center gap-2 py-2 px-2">
                          {timeSlots.map((time) => {
                            const isSelected = time === selectedStartTime;
                            return (
                              <Button
                                key={time}
                                className={`w-full shadow-none ${
                                  isSelected &&
                                  "bg-[#086280] text-white hover:bg-[#086280]/90"
                                }`}
                                onClick={() => {
                                  const [hours, minutes] = time
                                    .split(":")
                                    .map(Number);
                                  const newDate = new Date(startTime);
                                  newDate.setHours(hours, minutes, 0, 0);
                                  setStartTime(newDate);
                                }}
                              >
                                {time}
                              </Button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="col-span-1 flex flex-col">
              <Label htmlFor={"start"} className="gap-1">
                Kết thúc lúc <span className="text-red-500">*</span>
              </Label>
              <div className="w-full flex items-center border-b border-gray-400 focus-within:border-[#086280]">
                <input
                  readOnly
                  value={
                    allDay ? formatDateOnly(endTime) : formatDateTime(endTime)
                  }
                  className="flex-1 min-w-0 py-2 outline-none bg-transparent truncate"
                />

                {/* Date button */}
                <Popover open={open2} onOpenChange={setOpen2} side="right">
                  <PopoverTrigger asChild>
                    <button className="p-2 text-gray-600 hover:text-[#086280]">
                      <CalendarIcon />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="flex p-0 w-auto bg-white">
                    <Calendar
                      mode="single"
                      className={"rounded-md"}
                      selected={endTime}
                      onSelect={(date) => {
                        if (!date) return;
                        const newDate = new Date(endTime);
                        newDate.setFullYear(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate()
                        );
                        setEndTime(newDate);
                      }}
                      initialFocus
                    />

                    {!allDay && (
                      <ScrollArea
                        className="rounded-md max-h-[300px] w-[100px]"
                        onWheel={
                          (e) => e.stopPropagation()
                          // Ngăn sự kiện cuộn bị Dialog bắt mất
                        }
                      >
                        <div className="flex flex-col items-center gap-2 py-2 px-2">
                          {timeSlots.map((time) => {
                            const isSelected = time === selectedEndTime;
                            return (
                              <Button
                                key={time}
                                className={`w-full shadow-none ${
                                  isSelected &&
                                  "bg-[#086280] text-white hover:bg-[#086280]/90"
                                }`}
                                onClick={() => {
                                  const [hours, minutes] = time
                                    .split(":")
                                    .map(Number);
                                  const newDate = new Date(endTime);
                                  newDate.setHours(hours, minutes, 0, 0);
                                  setEndTime(newDate);
                                }}
                              >
                                {time}
                              </Button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="col-span-1 flex items-center gap-2">
              <Checkbox id="all" checked={allDay} onCheckedChange={setAllDay} />
              <Label htmlFor="all" className="gap-1">
                Cả ngày
              </Label>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-gray-200 hover:bg-gray-300 text-black">
              Hủy
            </Button>
          </DialogClose>
          <Button
            className="bg-[#086280] hover:bg-[#065a70] text-white"
            onClick={handleAddEvent}
          >
            Thêm sự kiện
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddEventDialog;
