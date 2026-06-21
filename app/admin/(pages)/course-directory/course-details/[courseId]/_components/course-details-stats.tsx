import { Radio, RotateCcw, UserRound, WalletCards } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { CourseEnrollmentSummary } from "@/types/course-directory/course-commerce.type";
import type { Course } from "@/types/course-directory/course.type";

interface CourseDetailsStatsProps {
  course: Course;
  summary: CourseEnrollmentSummary | null;
}

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const CourseDetailsStats = ({ course, summary }: CourseDetailsStatsProps) => {
  const totalStudents =
    summary?.totalStudents ?? course.totalStudentEnrollments ?? 0;

  const activeNow = summary?.activeNow || 0;
  const revenue = summary?.revenueYtd || 0;
  const refunded = summary?.refunded || 0;
  const currency = summary?.currency || "EUR";

  const stats = [
    {
      id: "total-students",
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      badge: summary?.totalStudentsBadge || "Current enrollments",
      icon: UserRound,
      variant: "primary",
    },
    {
      id: "active-now",
      title: "Active Now",
      value: activeNow.toLocaleString(),
      badge: summary?.activeNowBadge || "Live engagement",
      icon: Radio,
      variant: "default",
    },
    {
      id: "revenue",
      title: "Revenue (YTD)",
      value: formatCurrency(revenue, currency),
      badge: summary?.revenueBadge || "Paid revenue",
      icon: WalletCards,
      variant: "default",
    },
    {
      id: "refunded",
      title: "Refunded",
      value: refunded.toLocaleString(),
      badge: summary?.refundedBadge || "Refund records",
      icon: RotateCcw,
      variant: "danger",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPrimary = stat.variant === "primary";
        const isRefunded = stat.variant === "danger";

        return (
          <Card
            key={stat.id}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className={`min-h-44 ${
              isPrimary ? "!bg-[#006B3F] text-white" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <p
                className={
                  isPrimary ? "text-white/70" : "text-sm text-black/55"
                }
              >
                {stat.title}
              </p>

              <div
                className={`flex size-10 items-center justify-center rounded-full ${
                  isPrimary
                    ? "bg-white/15"
                    : isRefunded
                      ? "bg-[#FFD9D9]"
                      : "bg-[#E9FBEF]"
                }`}
              >
                <Icon
                  className={`size-5 ${
                    isPrimary
                      ? "text-white"
                      : isRefunded
                        ? "text-[#D34A3A]"
                        : "text-[#006B3F]"
                  }`}
                />
              </div>
            </div>

            <h3
              className={`mt-6 text-4xl font-bold ${
                isPrimary ? "text-white" : "text-[#202420]"
              }`}
            >
              {stat.value}
            </h3>

            <span
              className={`mt-6 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
                isPrimary
                  ? "bg-white/15 text-white"
                  : isRefunded
                    ? "bg-[#FFD9D9] text-[#D34A3A]"
                    : "bg-[#DDFBE6] text-[#00864F]"
              }`}
            >
              {stat.badge}
            </span>
          </Card>
        );
      })}
    </section>
  );
};

export default CourseDetailsStats;
