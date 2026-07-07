import { BookOpen, TrendingUp, UsersRound } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { CourseDirectorySummary } from "@/types/course-directory/course.type";

interface CourseDirectoryStatsProps {
  summary: CourseDirectorySummary;
  isLoading: boolean;
}

const CourseDirectoryStats = ({
  summary,
  isLoading,
}: CourseDirectoryStatsProps) => {
  const stats = [
    {
      id: "total-courses",
      title: "Total Courses",
      value: isLoading ? "..." : summary.totalCourses.toLocaleString(),
      icon: BookOpen,
      iconBg: "bg-[#DDFBE6]",
      iconColor: "text-[#006B3F]",
    },
    {
      id: "active-students",
      title: "Active Students",
      value: isLoading ? "..." : summary.activeStudents.toLocaleString(),
      icon: UsersRound,
      iconBg: "bg-[#FFEBDD]",
      iconColor: "text-[#C46A00]",
    },
    {
      id: "avg-completion",
      title: "Avg. Completion Rate",
      value: isLoading ? "..." : `${summary.averageCompletionRate}%`,
      icon: TrendingUp,
      iconBg: "bg-[#DFF3F4]",
      iconColor: "text-[#006B3F]",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.id}
            padding="lg"
            rounded="3xl"
            shadow="sm"
            className="min-h-32"
          >
            <div className="flex items-center gap-5">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-full ${stat.iconBg}`}
              >
                <Icon className={`size-6 ${stat.iconColor}`} />
              </div>

              <div>
                <p className="text-sm uppercase text-black/55">{stat.title}</p>

                <h3 className="mt-1 text-3xl font-medium text-[#202420]">
                  {stat.value}
                </h3>
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default CourseDirectoryStats;
