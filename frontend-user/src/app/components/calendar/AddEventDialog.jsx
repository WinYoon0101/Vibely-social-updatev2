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
import { CalendarIcon, Clock, PenLine, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateOnly, formatDateTime, getTime } from "@/lib/calendar";
import { createEvent, editEvent } from "@/service/calendar.service";

function AddEventDialog({
  item = null,
  setEvents,
  isEdit = false,
  event = null,
}) {
  const date = item?.date;
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [title, setTitle] = useState(event?.subject || "");
  const [color, setColor] = useState(event?.categoryColor || "#2563EB");
  const [startTime, setStartTime] = useState(
    isEdit ? new Date(event.startTime) : new Date(date)
  );
  const [endTime, setEndTime] = useState(() => {
    const d = new Date(startTime);
    d.setMinutes(d.getMinutes() + 30);
    return d;
  });
  useEffect(() => {
    setStartTime(() => {
      if (isEdit) {
        return new Date(event.startTime);
      } else {
        const d = new Date(date);
        d.setHours(9, 0, 0, 0); // Set default start time to 9 AM
        return d;
      }
    });
    setEndTime(() => {
      if (isEdit) {
        return new Date(event.endTime);
      } else {
        const d = new Date(startTime);
        d.setMinutes(d.getMinutes() + 30);
        return d;
      }
    });
  }, [date]);
  const isAllDay = (() => {
    const start = new Date(
      event?.startTime?.$date || event?.startTime
    );
    const end = new Date(event?.endTime?.$date || event?.endTime);

    const isStartOfHeader =
      start.getHours() === 0 && start.getMinutes() === 0;
    const isEndOfDay =
      (end.getHours() === 23 && end.getMinutes() === 59) ||
      (end.getHours() === 0 &&
        end.getMinutes() === 0 &&
        end.getTime() > start.getTime());

    return isStartOfHeader && isEndOfDay;
  })();
  const [allDay, setAllDay] = useState(isEdit? isAllDay : false);
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
      const newEvent = await createEvent({
        subject: title,
        startTime: startTime,
        endTime: endTime,
        categoryColor: color || "#2563EB",
      });
      setEvents((prev) => [...prev, newEvent]);
      toast.success("Thêm sự kiện thành công");
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditEvent = async () => {
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
      const editedEvent = await editEvent(event._id,{
        subject: title,
        startTime: startTime,
        endTime: endTime,
        categoryColor: color || "#2563EB",
      });
      setEvents((prev) =>
        prev.map((e) => (e._id === editedEvent._id ? editedEvent : e))
      );
      toast.success("Cập nhật sự kiện thành công");
      setOpen(false);
    } catch (error) {
      console.log("Lỗi khi cập nhật sự kiện: ", error);
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
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const totalMinutes = i * 30;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button className="shadow-none text-white hover:bg-gray-200/40">
            <PenLine />
          </Button>
        ) : (
          <div
            className={`p-2 h-full text-left cursor-pointer h-full col-span-1 border border-1 border-gray-300 hover:border-blue-500 hover:border-2
                  ${
                    item.currentMonth ? "bg-white" : "bg-gray-100 text-gray-400"
                  }`}
          >
            <span
              className={`
                        rounded-full w-7 h-7 inline-flex items-center justify-center ${
                          item.date.getDate() === today.getDate() &&
                          item.date.getMonth() === today.getMonth() &&
                          item.date.getFullYear() === today.getFullYear()
                            ? "font-bold text-white bg-[#086280]"
                            : "bg-transparent"
                        }`}
            >
              {item.date.getDate()}
            </span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-lg bg-white"
        // Chặn chỉ có thể đóng khi bấm DialogClose
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className={"flex flex-col gap-2"}>
          <DialogTitle>{isEdit ? "Cập nhật sự kiện" : "Sự kiện mới"}</DialogTitle>
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
                            const isSelected = time === getTime(startTime);
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
                            const isSelected = time === getTime(endTime);
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
          {isEdit?(
            <Button
            className="bg-[#086280] hover:bg-[#065a70] text-white"
            onClick={handleEditEvent}
          >
            Cập nhật
          </Button>
          ):(
            <Button
            className="bg-[#086280] hover:bg-[#065a70] text-white"
            onClick={handleAddEvent}
          >
            Thêm sự kiện
          </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddEventDialog;
