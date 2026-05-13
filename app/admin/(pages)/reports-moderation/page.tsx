import ModerationHeader from "./_components/moderation-header";
import ModerationStatsGrid from "./_components/moderation-stats-grid";
import QueueDetailsCard from "./_components/queue-details-card";

export default function ReportsModerationPage() {
    return (
        <div className="space-y-6">
            <ModerationHeader />
            <ModerationStatsGrid />
            <QueueDetailsCard />
        </div>
    );
}