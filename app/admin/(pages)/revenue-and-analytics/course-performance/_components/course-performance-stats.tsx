import { BadgeEuro, BookOpenCheck, Trophy } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { CourseOverviewResponse } from "@/types/revenue-and-analytics/revenue-and-analytics.type";

interface CoursePerformanceStatsProps {
  overview: CourseOverviewResponse | null;
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

export default function CoursePerformanceStats({
  overview,
}: CoursePerformanceStatsProps) {
  const cards = [
    {
      id: "total-course-revenue",

      title: "Total Course Revenue",

      value: formatCurrency(overview?.cards.totalCourseRevenue.lifetimeAmount),

      badge: `${formatChange(
        overview?.cards.totalCourseRevenue.changePercentage,
      )} period change`,

      icon: BadgeEuro,
    },
    {
      id: "best-selling-course",

      title: "Best-Selling Course",

      value: overview?.cards.bestSellingCourse?.name || "No course sales",

      badge: overview?.cards.bestSellingCourse
        ? `${overview.cards.bestSellingCourse.sales.toLocaleString()} sales`
        : "No sales",

      icon: Trophy,
    },
    {
      id: "course-listing",

      title: "Course Listing",

      value: `${(
        overview?.cards.courseListing.active || 0
      ).toLocaleString()} active`,

      badge: `${(
        overview?.cards.courseListing.total || 0
      ).toLocaleString()} total`,

      icon: BookOpenCheck,
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {cards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.id} padding="lg" rounded="3xl" className="min-h-40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E9FBEF]">
                <Icon className="size-5 text-[#006B3F]" />
              </div>

              <span className="max-w-[150px] rounded-full bg-[#E9FBEF] px-3 py-1 text-right text-xs font-bold text-[#007A4D]">
                {stat.badge}
              </span>
            </div>

            <div className="mt-7">
              <p className="text-sm text-black/50">{stat.title}</p>

              <h3 className="mt-1 line-clamp-2 text-2xl font-bold text-[#202420]">
                {stat.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
