"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import type { RevenueDatePreset } from "@/types/revenue-and-analytics/revenue-and-analytics.type";

interface RevenueDateRangeToolbarProps {
  preset: RevenueDatePreset;
  from: string;
  to: string;

  onApply: (values: {
    preset: RevenueDatePreset;
    from: string;
    to: string;
  }) => void;
}

const presetOptions: Array<{
  label: string;
  value: RevenueDatePreset;
}> = [
  {
    label: "Last 7 Days",
    value: "last_7_days",
  },
  {
    label: "Last 30 Days",
    value: "last_30_days",
  },
  {
    label: "Last 90 Days",
    value: "last_90_days",
  },
  {
    label: "This Month",
    value: "this_month",
  },
  {
    label: "This Year",
    value: "this_year",
  },
  {
    label: "All Time",
    value: "all_time",
  },
  {
    label: "Custom",
    value: "custom",
  },
];

export default function RevenueDateRangeToolbar({
  preset,
  from,
  to,
  onApply,
}: RevenueDateRangeToolbarProps) {
  const [draftPreset, setDraftPreset] = useState(preset);

  const [draftFrom, setDraftFrom] = useState(from);

  const [draftTo, setDraftTo] = useState(to);

  const customRangeInvalid =
    draftPreset === "custom" && (!draftFrom || !draftTo || draftFrom > draftTo);

  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF6EF]">
          <CalendarDays className="size-5 text-[#006B3F]" />
        </div>

        <div>
          <p className="text-sm font-semibold text-[#202420]">
            Reporting Period
          </p>

          <p className="text-xs text-[#7A847B]">
            All revenue values are normalized to EUR.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={draftPreset}
          onChange={(event) => {
            const nextPreset = event.target.value as RevenueDatePreset;

            setDraftPreset(nextPreset);

            if (nextPreset !== "custom") {
              onApply({
                preset: nextPreset,
                from: "",
                to: "",
              });
            }
          }}
          className="h-10 rounded-full bg-[#EEF2EC] px-4 text-xs font-semibold text-[#4F5B52] outline-none"
        >
          {presetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {draftPreset === "custom" && (
          <>
            <input
              type="date"
              value={draftFrom}
              onChange={(event) => setDraftFrom(event.target.value)}
              className="h-10 rounded-full bg-[#EEF2EC] px-4 text-xs text-[#4F5B52] outline-none"
            />

            <input
              type="date"
              value={draftTo}
              onChange={(event) => setDraftTo(event.target.value)}
              className="h-10 rounded-full bg-[#EEF2EC] px-4 text-xs text-[#4F5B52] outline-none"
            />

            <Button
              size="sm"
              rounded="full"
              disabled={customRangeInvalid}
              onClick={() =>
                onApply({
                  preset: "custom",
                  from: draftFrom,
                  to: draftTo,
                })
              }
            >
              Apply
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
