import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarClock, PenLine, Trash, X } from "lucide-react";
import React from "react";

function EventDetail({ trigger, event }) {
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
  const handleEdit = () => {};
  const handleDelete = () => {};
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="text-white !p-0 [&>button]:hidden"
        style={{
          backgroundColor: event?.categoryColor || "#086280",
        }}
      >
        <DialogHeader className={"relative"}>
          <div className="absolute top-0 right-0 p-2 flex items-center">
            <Button
              className="shadow-none text-white hover:bg-gray-200/40"
              onClick={handleEdit}
            >
              <PenLine />
            </Button>
            <Button
              className="shadow-none text-white hover:bg-gray-200/40"
              onClick={handleDelete}
            >
              <Trash />
            </Button>
            <DialogClose asChild>
              <Button className="shadow-none text-white hover:bg-gray-200/40">
                <X />
              </Button>
            </DialogClose>
          </div>
          <DialogTitle className="py-5 text-center text-[1.4rem]">
            {event?.subject}
          </DialogTitle>
          <div className="flex items-center gap-2 px-6 w-full py-5 bg-white text-black rounded-b-lg">
            <CalendarClock />
            <p>
              {formatDateTime(new Date(event?.startTime))} -{" "}
              {formatDateTime(new Date(event?.endTime))}
            </p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EventDetail;
