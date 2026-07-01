import { Gauge, ScanLine } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { CertificationCenterResponse } from "@/types/evaluation-center/evaluation-center.type";

interface CertificationBottomStatsProps {
  metric: CertificationCenterResponse["evaluationMetric"];
}

export default function CertificationBottomStats({
  metric,
}: CertificationBottomStatsProps) {
  const stats = [
    {
      id: "evaluation-time",

      label: "Evaluation Time",

      value: `${metric.evaluationDurationMinutes} minutes`,

      iconType: "time" as const,
    },
    {
      id: "score-reliability",

      label: "Score Reliability",

      value: `${metric.scoreReliabilityPercent}%`,

      iconType: "reliability" as const,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.id} padding="lg" rounded="3xl" shadow="sm">
          <div className="flex items-center gap-5">
            <div
              className={`flex size-12 items-center justify-center rounded-full ${
                stat.iconType === "time" ? "bg-[#DDF3E8]" : "bg-[#E7F1FF]"
              }`}
            >
              {stat.iconType === "time" ? (
                <Gauge className="size-5 text-[#006B3F]" />
              ) : (
                <ScanLine className="size-5 text-[#006B3F]" />
              )}
            </div>

            <div>
              <p className="text-sm text-[#66736A]">{stat.label}</p>

              <h3 className="text-base font-bold text-[#202420]">
                {stat.value}
              </h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
