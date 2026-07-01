import { BadgeEuro, BookOpen, Boxes, CalendarDays } from "lucide-react";

import type { RevenueOverviewResponse } from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import RevenueStatCard, {
  type RevenueStatViewModel,
} from "./revenue-stat-card";

interface AnalyticsOverviewCardsProps {
  overview: RevenueOverviewResponse | null;
}

const euro = (value?: string) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

const percent = (value?: number) => {
  return `${Number(value || 0).toFixed(2)}%`;
};

export default function AnalyticsOverviewCards({
  overview,
}: AnalyticsOverviewCardsProps) {
  const cards: RevenueStatViewModel[] = [
    {
      id: "lifetime",

      title: "Total Lifetime Revenue",

      value: euro(overview?.cards.totalLifetimeRevenue.amount),

      growth: `${percent(
        overview?.cards.totalLifetimeRevenue.periodChangePercentage,
      )} vs previous period`,

      icon: BadgeEuro,
      highlighted: true,
    },
    {
      id: "month",

      title: "Revenue This Month",

      value: euro(overview?.cards.revenueThisMonth.amount),

      growth: `${percent(
        overview?.cards.revenueThisMonth.changePercentage,
      )} vs previous month`,

      icon: CalendarDays,
    },
    {
      id: "courses",

      title: "Course Revenue",

      value: euro(overview?.cards.courseRevenue.amount),

      growth: `${overview?.cards.courseRevenue.sales || 0} sales`,

      icon: BookOpen,
    },
    {
      id: "packages",

      title: "All Packages Revenue",

      value: euro(overview?.cards.allPackagesRevenue.amount),

      growth: `${overview?.cards.allPackagesRevenue.sales || 0} sales`,

      icon: Boxes,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((stat) => (
        <RevenueStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
