import type { LucideIcon } from "lucide-react";

import Card from "@/components/UI/cards/card";

export interface RevenueStatViewModel {
  id: string;
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
  highlighted?: boolean;
}

interface RevenueStatCardProps {
  stat: RevenueStatViewModel;
}

export default function RevenueStatCard({ stat }: RevenueStatCardProps) {
  const Icon = stat.icon;

  return (
    <Card
      rounded="3xl"
      padding="lg"
      shadow="sm"
      className={`relative overflow-hidden ${
        stat.highlighted
          ? "!bg-[#006B3F] text-white"
          : "bg-white text-[#202420]"
      }`}
    >
      <div className="mb-8 flex items-start justify-between">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${
            stat.highlighted ? "bg-[#0D8751]" : "bg-[#EAF6EF]"
          }`}
        >
          <Icon
            className={`size-5 ${
              stat.highlighted ? "text-white" : "text-[#006B3F]"
            }`}
          />
        </div>

        <div
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            stat.highlighted
              ? "bg-[#0D8751] text-[#7DFFB8]"
              : "bg-[#EAF6EF] text-[#0B8A4D]"
          }`}
        >
          {stat.growth}
        </div>
      </div>

      <div className="space-y-2">
        <p
          className={
            stat.highlighted
              ? "text-sm text-white/70"
              : "text-sm text-[#6F7673]"
          }
        >
          {stat.title}
        </p>

        <h3 className="text-3xl font-bold">{stat.value}</h3>
      </div>
    </Card>
  );
}
