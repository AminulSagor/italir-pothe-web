import RecentRewardLog from "./_components/recent-reward-log";
import RewardHistoryHeader from "./_components/reward-history-header";
import RewardSummaryCard from "./_components/reward-summary-card";

export default function RewardHistoryPage() {
    return (
        <div className="mx-auto w-full max-w-[1180px] space-y-8">
            <RewardHistoryHeader />
            <RewardSummaryCard />
            <RecentRewardLog />
        </div>
    );
}