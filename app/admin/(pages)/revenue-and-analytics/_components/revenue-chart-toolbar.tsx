"use client";

import Button from "@/components/UI/buttons/button";

const RevenueChartToolbar = () => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        rounded="full"
        className="h-7 !bg-[#EEF2EC] px-4 text-[11px] !text-[#6F7673] hover:!bg-[#E3EAE0]"
      >
        Day
      </Button>

      <Button
        size="sm"
        rounded="full"
        className="h-7 bg-[#006B3F] px-4 text-[11px] text-white hover:bg-[#00552E]"
      >
        Week
      </Button>

      <Button
        size="sm"
        rounded="full"
        className="h-7 !bg-[#EEF2EC] px-4 text-[11px] !text-[#6F7673] hover:!bg-[#E3EAE0]"
      >
        Month
      </Button>
    </div>
  );
};

export default RevenueChartToolbar;
