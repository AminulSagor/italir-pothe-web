import AnalyticsOverviewCards from "./_components/analytics-overview-cards";
import RevenueGrowthChart from "./_components/revenue-growth-chart";
import RecentSuccessfulTransactions from "./_components/recent-successful-transactions";

const RevenueAndAnalyticsPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#006B3F]">Analytics Overview</h1>

      <AnalyticsOverviewCards />

      <RevenueGrowthChart />

      <RecentSuccessfulTransactions />
    </div>
  );
};

export default RevenueAndAnalyticsPage;
