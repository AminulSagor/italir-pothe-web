import { BadgeEuro, Boxes, CalendarDays, Trophy } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { PackageOverviewResponse } from "@/types/revenue-and-analytics/revenue-and-analytics.type";

interface PackagePerformanceStatsProps {
  overview: PackageOverviewResponse | null;
}

const formatCurrency = (value?: string | null) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

const formatChange = (value?: number) => {
  const numericValue = Number(value || 0);

  const prefix = numericValue > 0 ? "+" : "";

  return `${prefix}${numericValue.toFixed(2)}%`;
};

export default function PackagePerformanceStats({
  overview,
}: PackagePerformanceStatsProps) {
  const cards = [
    {
      id: "total-package-revenue",

      title: "Total Package Revenue",

      value: formatCurrency(overview?.cards.totalPackageRevenue.amount),

      badge: `${formatChange(
        overview?.cards.totalPackageRevenue.periodChangePercentage,
      )} selected period`,

      icon: BadgeEuro,

      variant: "primary" as const,
    },
    {
      id: "package-month-revenue",

      title: "Revenue This Month",

      value: formatCurrency(overview?.cards.revenueThisMonth.amount),

      badge: `${formatChange(
        overview?.cards.revenueThisMonth.changePercentage,
      )} vs last month`,

      icon: CalendarDays,

      variant: "default" as const,
    },
    {
      id: "course-revenue",

      title: "Course Revenue",

      value: formatCurrency(overview?.cards.courseRevenue.amount),

      badge: "Selected period",

      icon: Boxes,

      variant: "default" as const,
    },
    {
      id: "best-selling-package",

      title: "Best-Selling Package",

      value: overview?.cards.bestSeller?.name || "No package sales",

      badge: overview?.cards.bestSeller
        ? `${overview.cards.bestSeller.sales.toLocaleString()} sales`
        : "No sales",

      icon: Trophy,

      variant: "default" as const,
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => {
        const Icon = stat.icon;

        const isPrimary = stat.variant === "primary";

        return (
          <Card
            key={stat.id}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className={`min-h-40 ${
              isPrimary ? "!bg-[#006B3F] text-white" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                  isPrimary ? "bg-white/15" : "bg-[#E9FBEF]"
                }`}
              >
                <Icon
                  className={`size-5 ${
                    isPrimary ? "text-white" : "text-[#006B3F]"
                  }`}
                />
              </div>

              <span
                className={`max-w-[145px] rounded-full px-3 py-1 text-right text-xs font-bold ${
                  isPrimary
                    ? "bg-[#75FF33]/20 text-[#75FF33]"
                    : "bg-[#E9FBEF] text-[#007A4D]"
                }`}
              >
                {stat.badge}
              </span>
            </div>

            <div className="mt-7">
              <p
                className={
                  isPrimary ? "text-sm text-white/60" : "text-sm text-black/50"
                }
              >
                {stat.title}
              </p>

              <h3
                className={`mt-1 line-clamp-2 text-2xl font-bold ${
                  isPrimary ? "text-white" : "text-[#202420]"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
