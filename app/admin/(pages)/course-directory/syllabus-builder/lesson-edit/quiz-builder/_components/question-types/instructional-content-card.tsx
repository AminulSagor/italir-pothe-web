"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import Card from "@/components/UI/cards/card";

interface InstructionalContentCardProps {
  mainTitle: string;
}

export default function InstructionalContentCard({
  mainTitle,
}: InstructionalContentCardProps) {
  const [title, setTitle] = useState(mainTitle);

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#62F25A]">
          <FileText className="size-5 text-[#007A4A]" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#202420]">
            Instructional Content
          </h3>
          <p className="text-xs text-[#66736B]">
            Set the main question for this module
          </p>
        </div>
      </div>

      <label>
        <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
          Main Title
        </span>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="h-12 w-full rounded-full bg-[#EEF3EC] px-6 text-sm font-semibold text-[#202420] outline-none placeholder:text-[#A8B2AA]"
        />
      </label>
    </Card>
  );
}
