import { ChevronDown, Gift, Upload } from "lucide-react";

type RewardType = "physical-prize" | "ai-package" | "streak-freeze";

interface PrizeDetailsCardProps {
    rewardType: RewardType;
}

const rewardConfig = {
    "physical-prize": {
        assetType: "Physical Prize",
        note: "",
    },
    "ai-package": {
        assetType: "AI Package",
        note: "Congratulations Alex! Here’s a AI package to keep your momentum going during the upcoming holidays. Keep up the amazing work!",
    },
    "streak-freeze": {
        assetType: "Streak Freeze",
        note: "Congratulations Alex! Here’s a 3 day Streak Freeze package to keep your momentum going during the upcoming holidays. Keep up the amazing work!",
    },
};

export default function PrizeDetailsCard({ rewardType }: PrizeDetailsCardProps) {
    const config = rewardConfig[rewardType];

    const isPhysicalPrize = rewardType === "physical-prize";
    const isAiPackage = rewardType === "ai-package";
    const isStreakFreeze = rewardType === "streak-freeze";

    return (
        <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-white">
                    <Gift className="size-5" />
                </div>

                <h2 className="text-lg font-semibold text-black/90">
                    Prize Details
                </h2>
            </div>

            <div className="mt-8">
                <p className="mb-3 text-xs font-bold uppercase text-black/35">
                    Asset Type
                </p>

                <div className="flex h-14 items-center justify-between rounded-full bg-[#EEF3EC] px-6 text-base text-black/75">
                    <span>{config.assetType}</span>
                    <ChevronDown className="size-5 text-black/45" />
                </div>
            </div>

            {(isAiPackage || isStreakFreeze) && (
                <div className="mt-6">
                    <p className="mb-3 text-xs font-bold uppercase text-black/35">
                        Reward Value / Quantity
                    </p>

                    {isAiPackage ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <ValueBox value="500" unit="Tokens" />
                            <ValueBox value="60" unit="Mins" />
                        </div>
                    ) : (
                        <ValueBox value="3" unit="Units" />
                    )}
                </div>
            )}

            <div className="mt-6">
                <p className="mb-3 text-xs font-bold uppercase text-black/35">
                    Congratulatory Note
                </p>

                <textarea
                    defaultValue={config.note}
                    placeholder="Write a personalized Short message message for the student..."
                    className="min-h-[130px] w-full resize-none rounded-[2rem] bg-[#EEF3EC] p-6 text-base leading-7 outline-none placeholder:text-black/40"
                />
            </div>

            {isPhysicalPrize && (
                <div className="mt-7">
                    <p className="mb-3 text-xs font-bold uppercase text-black/35">
                        Prize Photo
                    </p>

                    <label className="flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#B8C9BA] bg-[#F8FAF6] text-center">
                        <input type="file" accept="image/png,image/jpeg" className="hidden" />
                        <Upload className="size-6 text-black/45" />

                        <p className="mt-5 text-base text-black/70">
                            Drag image here or{" "}
                            <span className="font-semibold text-secondary">browse</span>
                        </p>

                        <p className="mt-3 text-xs uppercase text-black/35">
                            PNG, JPG up to 10MB
                        </p>
                    </label>
                </div>
            )
            }
        </section >
    );
}

function ValueBox({ value, unit }: { value: string; unit: string }) {
    return (
        <div className="flex h-14 items-center justify-between rounded-full bg-[#EEF3EC] px-6">
            <span className="text-base text-black/75">{value}</span>
            <span className="text-xs font-semibold uppercase text-black/35">
                {unit}
            </span>
        </div>
    );
}