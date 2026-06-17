"use client";

import { useRef } from "react";
import { Palette } from "lucide-react";

interface Props {
  selectedColor: string;
  onChange: (color: string) => void;
}

const colors = ["#D9ECFF", "#F6E8D4", "#DDEEEE", "#EADDF0"];

export default function ColorPicker({ selectedColor, onChange }: Props) {
  const customColorRef = useRef<HTMLInputElement>(null);
  const isCustomColor = !colors.includes(selectedColor);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`size-10 rounded-full border-2 transition ${
            selectedColor === color ? "border-[#006B3F]" : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}

      <div className="h-8 w-px bg-[#D8DED7]" />

      <input
        ref={customColorRef}
        type="color"
        value={selectedColor}
        onChange={(event) => onChange(event.target.value)}
        className="sr-only"
      />

      <button
        type="button"
        onClick={() => customColorRef.current?.click()}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm text-[#4D574F] ${
          isCustomColor
            ? "border-[#006B3F] bg-[#E6F7EC]"
            : "border-[#D8DED7] bg-[#F4F6F3]"
        }`}
      >
        <Palette className="size-4" />
        CUSTOM
      </button>
    </div>
  );
}
