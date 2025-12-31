"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";


/* ===== Avatar fake attendees ===== */
export const avatarImages = [
  "/images/avatar-1.jpeg",
  "/images/avatar-2.jpeg",
  "/images/avatar-3.png",
  "/images/avatar-4.png",
  "/images/avatar-5.png",
];

const MeetingCard = ({
  title,
  date,
  icon,
  isPreviousMeeting = false,
  buttonIcon1,
  buttonText = "Vào họp",
  handleClick,
  link,
}) => {


  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-[#2C5784] px-5 py-8 xl:max-w-[568px]">
      {/* ===== Header ===== */}
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="meeting-icon" width={28} height={28} />

        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-base font-normal text-gray-300">
              {date}
            </p>
          </div>
        </div>
      </article>

      {/* ===== Footer ===== */}
      <article className="relative flex justify-center">
        {/* Avatars */}
        <div className="relative flex w-full max-sm:hidden">
          {avatarImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="attendee"
              width={40}
              height={40}
              className={cn("rounded-full", {
                absolute: index > 0,
              })}
              style={{ top: 0, left: index * 28 }}
            />
          ))}

          <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-[#252A41] bg-[#1E2757] text-sm font-semibold text-gray-300">
            +5
          </div>
        </div>

        {/* Actions */}
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button
              onClick={handleClick}
              className="flex items-center gap-2 rounded bg-[#0E78F9] px-6 text-white"
            >
              {buttonIcon1 && (
                <Image
                  src={buttonIcon1}
                  alt="action-icon"
                  width={20}
                  height={20}
                />
              )}
              {buttonText}
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast.success("Đã sao chép link cuộc họp!");
              }}
              className="flex items-center gap-2 bg-[#1E2757] px-6 text-white"
            >
              <Image
                src="/icons/copy.svg"
                alt="copy"
                width={20}
                height={20}
              />
              Sao chép link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
