"use client";

import Button from "@/components/UI/buttons/button";
import type { RevenueGraphRange } from "@/types/revenue-and-analytics/revenue-and-analytics.type";

interface RevenueChartToolbarProps {
  range: RevenueGraphRange;

  onChange: (range: RevenueGraphRange) => void;
}

export default function RevenueChartToolbar({
  range,
  onChange,
}: RevenueChartToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(["day", "week", "month"] as RevenueGraphRange[]).map((value) => (
        <Button
          key={value}
          size="sm"
          rounded="full"
          onClick={() => onChange(value)}
          className={`h-7 px-4 text-[11px] capitalize ${
            range === value
              ? "bg-[#006B3F] text-white hover:bg-[#00552E]"
              : "!bg-[#EEF2EC] !text-[#6F7673] hover:!bg-[#E3EAE0]"
          }`}
        >
          {value}
        </Button>
      ))}
    </div>
  );
}
