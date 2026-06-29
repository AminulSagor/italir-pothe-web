"use client";

import { ArrowLeft } from "lucide-react";

interface BreadcrumbHeaderProps {
  onBack: () => void;
}

export default function BreadcrumbHeader({ onBack }: BreadcrumbHeaderProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        type="button"
        onClick={onBack}
        className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-[#006B3F]"
        aria-label="Back to examinee queue"
      >
        <ArrowLeft className="size-4" />
      </button>

      <span className="text-[#66736A]">Examinee Queue</span>

      <span className="text-[#A1AAA3]">›</span>

      <span className="font-semibold text-[#006B3F]">Evaluate Student</span>
    </div>
  );
}
