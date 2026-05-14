import SurvivalStatCard from "./survival-stat-card";

import { survivalStatsMock } from "@/mock/survival-italian/survival-italian.mock";

export default function SurvivalStatsGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {survivalStatsMock.map((stat) => (
        <SurvivalStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
