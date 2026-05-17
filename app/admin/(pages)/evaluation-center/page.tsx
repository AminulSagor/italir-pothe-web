import EvaluationHeader from "./_components/evaluation-header";
import EvaluationStatsGrid from "./_components/evaluation-stats-grid";
import EvaluationToolbar from "./_components/evaluation-toolbar";
import EvaluationTable from "./_components/evaluation-table";

export default function EvaluationCenterPage() {
  return (
    <section className="space-y-6">
      <EvaluationHeader />
      <EvaluationStatsGrid />
      <EvaluationToolbar />
      <EvaluationTable />
    </section>
  );
}
