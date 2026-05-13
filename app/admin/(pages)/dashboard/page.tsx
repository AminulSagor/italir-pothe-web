import DashboardStats from "./_components/dashboard-stats";
import RecentPurchasesCard from "./_components/recent-purchases-card";
import RevenueGrowthCard from "./_components/revenue-growth-card";

const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <DashboardStats />
      <RevenueGrowthCard />
      <RecentPurchasesCard />
    </section>
  );
};

export default DashboardPage;
