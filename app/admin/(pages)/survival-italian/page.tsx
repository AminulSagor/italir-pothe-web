import SurvivalItalianHeader from "./_components/survival-italian-header";
import SurvivalSituationsTable from "./_components/survival-situations-table";
import SurvivalStatsGrid from "./_components/survival-stats-grid";

export default function SurvivalItalianPage() {
  return (
    <section className="space-y-8">
      <SurvivalItalianHeader />

      <SurvivalStatsGrid />

      <SurvivalSituationsTable />
    </section>
  );
}
