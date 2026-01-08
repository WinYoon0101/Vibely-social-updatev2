import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarClock, Trash } from "lucide-react";
import React, { useState } from "react";
import AddEventDialog from "./AddEventDialog";
import { deleteEvent } from "@/service/calendar.service";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function EventDetail({ trigger, event, setEvents }) {
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
  const handleDelete = async () => {
    try {
      await deleteEvent(event?._id);
      setEvents((prevEvents) => prevEvents.filter((e) => e._id !== event._id));
      toast.success("Xóa sự kiện thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sự kiện:", error);
    }
  };
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        aria-describedby={undefined}
        className="text-white !p-0 [&>button]:hidden"
        style={{
          backgroundColor: event?.categoryColor || "#086280",
        }}
      >
        <div>
          <div className="justify-end flex items-center">
            <AddEventDialog isEdit={true} event={event} setEvents={setEvents} />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="shadow-none text-white hover:bg-gray-200/40">
                  <Trash />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Bạn có chắc chắn muốn xóa sự kiện này?
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      className="bg-red-500 hover:bg-red-700 text-white"
                      onClick={handleDelete}
                    >
                      Xóa
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button className="bg-gray-200 hover:bg-gray-300 text-black">
                      Hủy
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <p className="px-2 pb-2 text-left font-semibold">{event?.subject}</p>
          <div className="flex items-center gap-2 px-6 w-full py-5 bg-white text-black rounded-b-sm">
            <CalendarClock />
            <p>
              {formatDateTime(new Date(event?.startTime))} -{" "}
              {formatDateTime(new Date(event?.endTime))}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EventDetail;
