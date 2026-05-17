import FulfillmentActionsCard from "./_components/fulfillment-actions-card";
import RewardDetailHeader from "./_components/reward-detail-header";
import RewardPrizeCard from "./_components/reward-prize-card";
import RewardUserCard from "./_components/reward-user-card";
import ShippingCard from "./_components/shipping-card";

type RewardStatus = "notified" | "received" | "rewarded" | "digital";

interface RewardFulfillmentDetailPageProps {
    searchParams: Promise<{
        status?: string;
    }>;
}

export default async function RewardFulfillmentDetailPage({
    searchParams,
}: RewardFulfillmentDetailPageProps) {
    const { status } = await searchParams;

    const rewardStatus: RewardStatus =
        status === "received" || status === "rewarded" || status === "digital"
            ? status
            : "notified";

    const isDigital = rewardStatus === "digital";
    const showFulfillmentActions =
        rewardStatus === "received" || rewardStatus === "notified";

    return (
        <div className="mx-auto w-full max-w-[1120px] space-y-8">
            <RewardDetailHeader status={rewardStatus} />

            <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
                <RewardUserCard />

                <div className="space-y-7">
                    <RewardPrizeCard status={rewardStatus} />

                    {!isDigital && <ShippingCard status={rewardStatus} />}

                    {showFulfillmentActions && <FulfillmentActionsCard />}
                </div>
            </div>
        </div>
    );
}