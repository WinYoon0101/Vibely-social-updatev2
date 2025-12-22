"use client";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className = "",
  children,
  handleClick,
  buttonText,
  image,
  buttonClassName = "",
  buttonIcon,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-[#1C1F2E] px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="icon" width={72} height={72} />
            </div>
          )}

          {/* BẮT BUỘC cho accessibility */}
          <DialogTitle
            className={`text-3xl font-bold leading-[42px] ${className}`}
          >
            {title}
          </DialogTitle>

          {children}

          <Button
            className={`bg-[#0E78F9] focus-visible:ring-0 focus-visible:ring-offset-0 ${buttonClassName}`}
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image
                src={buttonIcon}
                alt="button icon"
                width={13}
                height={13}
              />
            )}
            {buttonIcon && <span className="mx-1" />}
            {buttonText || "Lên lịch cuộc họp"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
