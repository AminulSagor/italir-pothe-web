"use client";

import { Lock } from "lucide-react";

import Card from "@/components/UI/cards/card";

interface AccessControlCardProps {
  isFree: boolean;
  disabled?: boolean;
  onChange: (isFree: boolean) => void;
}

export default function AccessControlCard({
  isFree,
  disabled = false,
  onChange,
}: AccessControlCardProps) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-7 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#FBE4E4]">
          <Lock className="size-4 text-[#B64A4A]" />
        </div>

        <h2 className="text-lg font-bold text-[#202420]">Access Control</h2>
      </div>

      <div className="grid grid-cols-2 rounded-full bg-[#EEF3EC] p-1">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(true)}
          className={`flex h-10 items-center justify-center gap-2 rounded-full text-sm disabled:cursor-not-allowed ${
            isFree ? "bg-[#007A4A] font-bold text-white" : "text-[#526057]"
          }`}
        >
          <Lock className="size-3" />
          Free
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(false)}
          className={`flex h-10 items-center justify-center gap-2 rounded-full text-sm disabled:cursor-not-allowed ${
            !isFree ? "bg-[#007A4A] font-bold text-white" : "text-[#526057]"
          }`}
        >
          <Lock className="size-3" />
          Premium
        </button>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-[#66736B]">
        {isFree
          ? "Currently available for all students."
          : "Currently locked for non-subscribers."}
      </p>
    </Card>
  );
}
