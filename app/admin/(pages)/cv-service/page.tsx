import CVGenerationTrends from "./_components/cv-generation-trends";
import CVServiceHeader from "./_components/cv-service-header";
import CVStatsGrid from "./_components/cv-stats-grid";
import RecentCVTransactions from "./_components/recent-cv-transactions";

export default function CVServiceDashboardPage() {
  return (
    <div className="space-y-6">
      <CVServiceHeader />
      <CVStatsGrid />
      <CVGenerationTrends />
      <RecentCVTransactions />
    </div>
  );
}
