import InfluencerHubHeader from "./_components/influencer-hub-header";
import InfluencerSearchBar from "./_components/influencer-search-bar";
import InfluencerStatsGrid from "./_components/influencer-stats-grid";
import PartnerPerformanceTable from "./_components/partner-performance-table";

export default function InfluencerHubPage() {
    return (
        <div className="space-y-6">
            <InfluencerHubHeader />
            <InfluencerSearchBar />
            <InfluencerStatsGrid />
            <PartnerPerformanceTable />
        </div>
    );
}