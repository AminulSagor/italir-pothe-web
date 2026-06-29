import { TrendingDown, TrendingUp } from "lucide-react";

import type { AdminUserDashboardResponse } from "@/types/user-directory/user-directory.type";

interface UserStatsGridProps {
  dashboard: AdminUserDashboardResponse | null;
}

const formatChange = (value: number) => {
  const absoluteValue = Math.abs(value);

  return `${absoluteValue.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
};

export default function UserStatsGrid({ dashboard }: UserStatsGridProps) {
  const stats = [
    {
      label: "Total Users",

      value: dashboard?.totalUsers.value || 0,

      change: dashboard?.totalUsers.changePercent || 0,

      suffix: "",
    },
    {
      label: "Active This Month",

      value: dashboard?.activeThisMonth.value || 0,

      change: dashboard?.activeThisMonth.changePercent || 0,

      suffix: "",
    },
    {
      label: "Premium/Pro Users",

      value: dashboard?.premiumProUsers.count || 0,

      change: dashboard?.premiumProUsers.percentage || 0,

      suffix: " of users",
    },
    {
      label: "New Signups Today",

      value: dashboard?.newSignupsToday.value || 0,

      change: dashboard?.newSignupsToday.changePercent || 0,

      suffix: "",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const isNegative = item.change < 0;

        const TrendIcon = isNegative ? TrendingDown : TrendingUp;

        return (
          <div
            key={item.label}
            className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5"
          >
            <p className="text-sm font-semibold uppercase text-black/35">
              {item.label}
            </p>

            <div className="mt-4 flex items-end justify-between gap-3">
              <h2 className="text-[2rem] font-bold text-black/90">
                {item.value.toLocaleString()}
              </h2>

              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  isNegative ? "text-[#D92D20]" : "text-secondary"
                }`}
              >
                <TrendIcon className="size-4" />

                {formatChange(item.change)}

                {item.suffix}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
