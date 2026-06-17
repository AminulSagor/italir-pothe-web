"use client";

import { useState } from "react";

import SituationIconPreview from "../icons/situation-icon-preview";
import {
  getSurvivalIconOption,
  survivalIconOptions,
} from "../../_utils/survival-italian-ui.util";

interface Props {
  selectedColor: string;
  selectedIconKey: string;
  onIconChange: (iconKey: string) => void;
}

export default function VisualIdentityPanel({
  selectedColor,
  selectedIconKey,
  onIconChange,
}: Props) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const selectedIcon = getSurvivalIconOption(selectedIconKey);

  return (
    <div className="flex flex-col items-center justify-center border-b border-[#EEF2EE] bg-[#F6F8F4] px-5 py-8 md:border-b-0 md:border-r md:px-8 md:py-10">
      <SituationIconPreview
        Icon={selectedIcon.Icon}
        backgroundColor={selectedColor}
        onClick={() => setIconPickerOpen((currentValue) => !currentValue)}
      />

      {iconPickerOpen ? (
        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {survivalIconOptions.map((option) => {
            const Icon = option.Icon;
            const selected = option.key === selectedIconKey;

            return (
              <button
                key={option.key}
                type="button"
                title={option.label}
                onClick={() => {
                  onIconChange(option.key);
                  setIconPickerOpen(false);
                }}
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
      ) : null}

      <h3 className="mt-8 text-center text-base font-semibold text-[#006B3F]">
        Visual Identity
      </h3>

      <p className="mt-3 text-center text-sm leading-6 text-[#4D574F]">
        Configure how the situation appears to students in the mobile app.
      </p>
    </div>
  );
}
