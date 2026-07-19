import { CircleCheck, ClipboardCheck, Clock3 } from "lucide-react";

import type { ModerationDashboardMetricsResponse } from "@/types/reports-moderation/reports-moderation.type";

interface ModerationStatsGridProps {
  metrics: ModerationDashboardMetricsResponse | null;

  isLoading: boolean;
}

const formatChange = (value: number) => {
  if (value > 0) {
    return `+${value}%`;
  }

  return `${value}%`;
};

export default function ModerationStatsGrid({
  metrics,
  isLoading,
}: ModerationStatsGridProps) {
  const stats = [
    {
      id: "pending",
      label: "Total Pending",

      value: metrics?.total_pending_count.toLocaleString() ?? "0",

      change: metrics?.pending_percentage_change ?? 0,

      isPositiveGood: false,

      icon: ClipboardCheck,
    },
    {
      id: "response",
      label: "Avg. Response",

      value:
        metrics?.avg_response_time_minutes !== null &&
        metrics?.avg_response_time_minutes !== undefined
          ? `${metrics.avg_response_time_minutes}m`
          : "—",

      change: metrics?.response_time_percentage_change ?? 0,

      isPositiveGood: false,

      icon: Clock3,
    },
    {
      id: "resolved",
      label: "Resolved Today",

      value: metrics?.resolved_today_count.toLocaleString() ?? "0",

      change: metrics?.resolved_today_percentage_change ?? 0,

      isPositiveGood: true,

      icon: CircleCheck,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        const isGood = stat.isPositiveGood
          ? stat.change >= 0
          : stat.change <= 0;

        return (
          <section
            key={stat.id}
            className="flex min-h-[130px] justify-between rounded-[2rem] bg-white p-6 shadow-sm"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-black/60">
                {stat.label}
              </p>

              {isLoading && !metrics ? (
                <div className="mt-3 h-8 w-20 animate-pulse rounded-lg bg-black/5" />
              ) : (
                <h2 className="mt-2 text-2xl font-bold text-black/90">
                  {stat.value}
                </h2>
              )}

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  isGood
                    ? "bg-green-100 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.change > 0 ? "↗" : stat.change < 0 ? "↘" : "→"}{" "}
                {formatChange(stat.change)}
              </span>
            </div>

            <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-secondary">
              <Icon className="size-5" />
            </span>
          </section>
        );
      })}
    </div>
  );
}
