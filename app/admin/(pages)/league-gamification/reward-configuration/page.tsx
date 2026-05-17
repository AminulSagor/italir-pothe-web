import PrizeDetailsCard from "./_components/prize-details-card";
import RewardHeader from "./_components/reward-header";
import SelectedUserCard from "./_components/selected-user-card";
import SystemActionsCard from "./_components/system-actions-card";

interface RewardConfigurationPageProps {
    searchParams: Promise<{
        type?: string;
    }>;
}

export default async function RewardConfigurationPage({
    searchParams,
}: RewardConfigurationPageProps) {
    const { type } = await searchParams;

    const rewardType =
        type === "ai-package" || type === "streak-freeze"
            ? type
            : "physical-prize";

    return (
        <div className="mx-auto w-full max-w-[1120px] space-y-7">
            <RewardHeader />

            <div className="grid gap-7 xl:grid-cols-[1fr_340px]">
                <div className="space-y-7">
                    <SelectedUserCard />
                    <PrizeDetailsCard rewardType={rewardType} />
                </div>

                <SystemActionsCard rewardType={rewardType} />
            </div>
        </div>
    );
}