import { Clock3, Gauge, ListChecks } from "lucide-react";

import type { EvaluationQueueStats } from "@/types/evaluation-center/evaluation-center.type";

import EvaluationStatCard, {
  type EvaluationStatViewModel,
} from "./evaluation-stat-card";

interface EvaluationStatsGridProps {
  stats: EvaluationQueueStats;
}

export default function EvaluationStatsGrid({
  stats,
}: EvaluationStatsGridProps) {
  const cards: EvaluationStatViewModel[] = [
    {
      id: "pending",

      title: "Pending Review",

      value: stats.pending.toLocaleString(),

      subtitle: "Exams waiting for manual grading",

      icon: ListChecks,

      iconBg: "bg-[#F3E5F4]",

      iconColor: "text-[#72556F]",
    },
    {
      id: "graded-today",

      title: "Graded Today",

      value: stats.gradedToday.toLocaleString(),

      subtitle: `${stats.gradedToday}/${stats.gradedTodayGoal} daily goal`,

      icon: Gauge,

      iconBg: "bg-[#DDF3E8]",

      iconColor: "text-[#006B3F]",
    },
    {
      id: "average-wait",

      title: "Average Wait Time",

      value: `${stats.averageWaitHours.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      })} hrs`,

      subtitle: stats.isWithinTarget
        ? `Within the ${stats.targetWaitHours}-hour target`
        : `Above the ${stats.targetWaitHours}-hour target`,

      icon: Clock3,

      iconBg: stats.isWithinTarget ? "bg-[#E7F1FF]" : "bg-[#FCEBEC]",

      iconColor: stats.isWithinTarget ? "text-[#3568C0]" : "text-[#B42318]",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cards.map((stat) => (
        <EvaluationStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
