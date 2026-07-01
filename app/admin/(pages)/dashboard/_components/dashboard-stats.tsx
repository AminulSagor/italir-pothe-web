import { BookOpenCheck, Euro, UserPlus, Users } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { AdminDashboardOverviewResponse } from "@/types/admin-dashboard/admin-dashboard.type";

interface DashboardStatsProps {
  overview: AdminDashboardOverviewResponse | null;
}

const formatCurrency = (value?: string) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

const formatGrowth = (value?: number) => {
  const numericValue = Number(value || 0);

  const prefix = numericValue > 0 ? "+" : "";

  return `${prefix}${numericValue.toFixed(2)}%`;
};

export default function DashboardStats({ overview }: DashboardStatsProps) {
  const dashboardStats = [
    {
      id: "monthly-revenue",

      title: "Monthly Revenue",

      value: formatCurrency(overview?.cards.monthlyRevenue.amount),

      growth: formatGrowth(overview?.cards.monthlyRevenue.changePercentage),

      growthValue: overview?.cards.monthlyRevenue.changePercentage || 0,

      icon: Euro,
    },
    {
      id: "total-students",

      title: "Total Students",

      value: (overview?.cards.totalStudents.value || 0).toLocaleString(),

      growth: formatGrowth(overview?.cards.totalStudents.changePercentage),

      growthValue: overview?.cards.totalStudents.changePercentage || 0,

      icon: Users,
    },
    {
      id: "active-courses",

      title: "Active Courses",

      value: (overview?.cards.activeCourses.value || 0).toLocaleString(),

      growth: formatGrowth(overview?.cards.activeCourses.changePercentage),

      growthValue: overview?.cards.activeCourses.changePercentage || 0,

      icon: BookOpenCheck,
    },
    {
      id: "new-student-signups",

      title: "New Student Signups",

      value: (overview?.cards.newStudentSignups.value || 0).toLocaleString(),

      growth: formatGrowth(overview?.cards.newStudentSignups.changePercentage),

      growthValue: overview?.cards.newStudentSignups.changePercentage || 0,

      icon: UserPlus,
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {dashboardStats.map((stat) => {
        const Icon = stat.icon;

        const isNegative = stat.growthValue < 0;

        return (
          <Card
            key={stat.id}
            className="min-h-48"
            padding="lg"
            rounded="3xl"
            shadow="sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-13 items-center justify-center rounded-full bg-[#E7F0ED]">
                <Icon className="size-6 text-[#007A4D]" />
              </div>

              <span
                className={`rounded-full px-4 py-1 text-sm font-semibold ${
                  isNegative
                    ? "bg-[#FCEBEC] text-[#B42318]"
                    : "bg-[#E9FBEF] text-[#00864F]"
                }`}
              >
                {stat.growth}
              </span>
            </div>

            <div className="mt-8">
              <p className="text-lg text-[#4B4B4B]">{stat.title}</p>

              <h3 className="mt-1 text-3xl font-bold text-[#1E1E1E]">
                {stat.value}
              </h3>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
