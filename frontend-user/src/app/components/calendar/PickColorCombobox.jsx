"use client";

import { useState } from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const colors = [
  {
    value: "#2563EB",
    label: "Xanh dương",
  },
  {
    value: "#16A34A",
    label: "Xanh lá",
  },
  {
    value: "#7C3AED",
    label: "Tím",
  },
  {
    value: "#EA580C",
    label: "Cam",
  },
  {
    value: "#DC2626",
    label: "Đỏ",
  },
  {
    value: "#EAB308",
    label: "Vàng",
  },
  {
    value: "#DB2777",
    label: "Hồng",
  },
];

const PickColorCombobox = ({ value, setValue }) => {
  const [open, setOpen] = useState(false);
  const selectedColor = colors.find((c) => c.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-xs justify-between rounded-none
              border-0
              border-b
              border-b-gray-300
              focus:border-b-2
              focus:border-[#086280]
              focus:outline-none"
          aria-label="color combobox"
        >
          <div className="flex gap-2 items-center">
            <span
              className="w-5 h-5 rounded-md"
              style={{ backgroundColor: value }}
            />
            {selectedColor?.label}
          </div>
          <ChevronsUpDownIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white border-none shadow-lg">
        <Command>
          <CommandList>
            <CommandGroup>
              {colors.map((color) => (
                <CommandItem
                  key={color.value}
                  value={color.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? value : currentValue);
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-md"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </span>
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      value === color.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PickColorCombobox;
