import AdminActionPanel from "./_components/admin-action-panel";
import ReportOverviewCard from "./_components/report-overview-card";
import ReporterNoteCard from "./_components/reporter-note-card";
import ResolveHeader from "./_components/resolve-header";
import SubjectStatsCard from "./_components/subject-stats-card";
import VisualEvidenceCard from "./_components/visual-evidence-card";

export default function ResolveReportPage() {
    return (
        <div className="mx-auto min-h-[calc(100vh-3rem)] w-full max-w-[1040px]">
            <ResolveHeader />

            <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_300px]">
                <div className="space-y-6">
                    <ReportOverviewCard />

                    <div className="grid gap-6 md:grid-cols-2">
                        <ReporterNoteCard />
                        <SubjectStatsCard />
                    </div>

                    <VisualEvidenceCard />
                </div>

                <AdminActionPanel />
            </div>
        </div>
    );
}