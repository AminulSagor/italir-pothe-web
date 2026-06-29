import type { LucideIcon } from "lucide-react";

import Card from "@/components/UI/cards/card";

export interface EvaluationStatViewModel {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

interface EvaluationStatCardProps {
  stat: EvaluationStatViewModel;
}

export default function EvaluationStatCard({ stat }: EvaluationStatCardProps) {
  const Icon = stat.icon;

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex size-10 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}
        >
          <Icon className="size-4" />
        </div>

        <div>
          <p className="text-sm text-[#4F5B52]">{stat.title}</p>

          <h3 className="mt-2 text-3xl font-bold text-[#006B3F]">
            {stat.value}
          </h3>

          <p className="mt-1 text-xs text-[#7A847B]">{stat.subtitle}</p>
        </div>
      </div>
    </Card>
  );
}
