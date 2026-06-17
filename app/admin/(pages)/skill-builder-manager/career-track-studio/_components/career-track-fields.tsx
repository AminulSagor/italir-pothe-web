"use client";

import {
  BriefcaseBusiness,
  CookingPot,
  Hotel,
  Palette,
  Store,
  Truck,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CareerTrackFieldsProps {
  title: string;
  subtitleBn: string;
  description: string;
  iconKey: string;
  cardColor: string;
  onTitleChange: (value: string) => void;
  onSubtitleBnChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onIconKeyChange: (value: string) => void;
  onCardColorChange: (value: string) => void;
}

interface IconOption {
  key: string;
  label: string;
  Icon: LucideIcon;
}

const iconOptions: IconOption[] = [
  {
    key: "fork_knife",
    label: "Restaurant",
    Icon: Utensils,
  },
  {
    key: "kitchen",
    label: "Kitchen",
    Icon: CookingPot,
  },
  {
    key: "store",
    label: "Store",
    Icon: Store,
  },
  {
    key: "logistics",
    label: "Logistics",
    Icon: Truck,
  },
  {
    key: "hotel",
    label: "Hotel",
    Icon: Hotel,
  },
  {
    key: "briefcase",
    label: "General",
    Icon: BriefcaseBusiness,
  },
];

const colorOptions = ["#FFEDE3", "#E7EFE7", "#D9ECFF", "#F6E8D4", "#EADDF0"];

export default function CareerTrackFields({
  title,
  subtitleBn,
  description,
  iconKey,
  cardColor,
  onTitleChange,
  onSubtitleBnChange,
  onDescriptionChange,
  onIconKeyChange,
  onCardColorChange,
}: CareerTrackFieldsProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#66736B]">
            CAREER TRACK TITLE
          </label>

          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Restaurant Job"
            className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#66736B]">
            BANGLA TRANSLATION
          </label>

          <input
            value={subtitleBn}
            onChange={(event) => onSubtitleBnChange(event.target.value)}
            placeholder="রেস্টুরেন্ট এর কাজ"
            className="h-14 w-full rounded-full bg-[#F3F5F1] px-6 text-sm outline-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-[#66736B]">
          DESCRIPTION
        </label>

        <textarea
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="Hospitality and service vocabulary tailored for dining and casual eateries in Italy."
          rows={4}
          className="w-full resize-none rounded-3xl bg-[#F3F5F1] px-6 py-4 text-sm outline-none"
        />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-3 block text-sm font-medium text-[#66736B]">
            ICON
          </label>

          <div className="flex flex-wrap gap-3">
            {iconOptions.map((option) => {
              const Icon = option.Icon;
              const selected = option.key === iconKey;

              return (
                <button
                  key={option.key}
                  type="button"
                  title={option.label}
                  onClick={() => onIconKeyChange(option.key)}
                  className={`flex size-11 items-center justify-center rounded-2xl border transition ${
                    selected
                      ? "border-[#006B3F] bg-[#E6F7EC]"
                      : "border-[#D8DED7] bg-white hover:bg-[#F4F8F3]"
                  }`}
                >
                  <Icon className="size-5 text-[#007A3D]" />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-[#66736B]">
            ICON COLOR
          </label>

          <div className="flex flex-wrap items-center gap-3">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onCardColorChange(color)}
                className={`size-10 rounded-full border-2 transition ${
                  cardColor === color
                    ? "border-[#006B3F]"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#D8DED7] bg-[#F4F6F3] px-5 py-2 text-sm text-[#4D574F]">
              <Palette className="size-4" />
              CUSTOM
              <input
                type="color"
                value={cardColor}
                onChange={(event) => onCardColorChange(event.target.value)}
                className="sr-only"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
