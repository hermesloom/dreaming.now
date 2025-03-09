"use client";

import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "@/components/theme-provider";

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const handleSelect = (emoji: any) => {
    onChange(emoji.native);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full h-14 text-3xl">
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 border-none"
        side="bottom"
        align="start"
      >
        <Picker
          data={data}
          onEmojiSelect={handleSelect}
          theme={theme === "dark" ? "dark" : "light"}
          previewPosition="none"
          skinTonePosition="none"
        />
      </PopoverContent>
    </Popover>
  );
}
