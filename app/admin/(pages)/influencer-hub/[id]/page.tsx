import EarningsGrowthCard from "./_components/earnings-growth-card";
import PartnerSummaryCard from "./_components/partner-summary-card";
import PayoutHistoryCard from "./_components/payout-history-card";
import ReportHeader from "./_components/report-header";

export default function InfluencerReportPage() {
    return (
        <div className="space-y-6">
            <ReportHeader />
            <PartnerSummaryCard />
            <EarningsGrowthCard />
            <PayoutHistoryCard />
        </div>
    );
}