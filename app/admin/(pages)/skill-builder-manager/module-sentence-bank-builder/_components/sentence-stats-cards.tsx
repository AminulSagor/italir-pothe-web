import { Cloud, Database } from "lucide-react";

import Card from "@/components/UI/cards/card";

interface SentenceStatsCardsProps {
  totalSentences: number;
  syncLabel: string;
}

export default function SentenceStatsCards({
  totalSentences,
  syncLabel,
}: SentenceStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card rounded="3xl" className="!bg-[#006B3F] p-8 text-white">
        <Database className="mb-6 size-6" />

        <h3 className="text-5xl font-bold">
          {totalSentences.toLocaleString()}
        </h3>

        <p className="mt-3 text-base text-white/80">Total Sentences in Bank</p>
      </Card>

      <Card rounded="3xl" className="p-8">
        <Cloud className="mb-6 size-6 text-[#006B3F]" />

        <h3 className="text-4xl font-bold text-[#202420]">Syncing</h3>

        <p className="mt-3 text-base text-[#66736B]">{syncLabel}</p>
      </Card>
    </div>
  );
}
