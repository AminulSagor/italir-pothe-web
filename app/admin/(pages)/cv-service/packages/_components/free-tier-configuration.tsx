import { BadgeEuro } from "lucide-react";

import Card from "@/components/UI/cards/card";

export default function FreeTierConfiguration() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm" className="bg-white">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-[#E6F6F0] text-[#006B3F]">
          <BadgeEuro className="size-5" />
        </span>

        <h2 className="text-base font-bold text-[#202420]">
          Free Tier Configuration
        </h2>
      </div>

      <p className="mb-3 text-xs font-semibold uppercase text-black/45">
        Free credits per new signup
      </p>

      <div className="flex items-center justify-between rounded-full bg-[#EEF3EB] px-5 py-3">
        <span className="text-lg font-bold text-[#006B3F]">2</span>
        <span className="text-xs text-black/55">credits</span>
      </div>

      <p className="mt-4 text-sm text-black/55">
        Each credit allows 1 PDF generation/download.
      </p>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-black/10 p-4">
        <div>
          <p className="text-sm font-medium text-[#202420]">Allow Editing</p>
          <p className="text-xs text-black/50">Editing without consuming credits</p>
        </div>

        <button className="relative h-6 w-11 rounded-full bg-[#56EF59]">
          <span className="absolute right-1 top-1 size-4 rounded-full bg-white" />
        </button>
      </div>
    </Card>
  );
}