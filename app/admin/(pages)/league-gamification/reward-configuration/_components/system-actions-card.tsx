import { BellRing, PartyPopper, ShieldCheck, Truck } from "lucide-react";

type RewardType = "physical-prize" | "ai-package" | "streak-freeze";

interface SystemActionsCardProps {
    rewardType: RewardType;
}

export default function SystemActionsCard({
    rewardType,
}: SystemActionsCardProps) {
    const showShipping = rewardType === "physical-prize";

    return (
        <aside className="h-fit rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-[#75FF33] text-secondary">
                    <ShieldCheck className="size-5" />
                </div>

                <h2 className="text-lg font-semibold text-black/90">
                    System Actions
                </h2>
            </div>

            <div className="mt-8 space-y-6">
                <ToggleRow
                    icon={<BellRing className="size-5" />}
                    title="Send Push Notification"
                />

                <ToggleRow
                    icon={<PartyPopper className="size-5" />}
                    title="Play confetti animation"
                />

                {showShipping && (
                    <ToggleRow
                        icon={<Truck className="size-5" />}
                        title="Request Shipping Address"
                    />
                )}
            </div>
        </aside>
    );
}

function ToggleRow({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-secondary">
                {icon}
                <p className="text-base font-medium text-black/75">{title}</p>
            </div>

            <button className="relative h-8 w-14 rounded-full bg-[#5AF256]">
                <span className="absolute right-1 top-1 size-6 rounded-full bg-white" />
            </button>
        </div>
    );
}