import EvaluationStatCard from "./evaluation-stat-card";
import { evaluationStatsMock } from "@/mock/evaluation-center/evaluation-center.mock";

export default function EvaluationStatsGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {evaluationStatsMock.map((stat) => (
        <EvaluationStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
