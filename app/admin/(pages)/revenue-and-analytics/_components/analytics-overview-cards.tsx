import RevenueStatCard from "./revenue-stat-card";

import { revenueStats } from "@/mock/revenue-and-analytics/revenue-analytics.mock";

const AnalyticsOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {revenueStats.map((stat) => (
        <RevenueStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
};

export default AnalyticsOverviewCards;
