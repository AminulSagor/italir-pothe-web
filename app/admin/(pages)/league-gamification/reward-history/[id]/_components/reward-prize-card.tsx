import { Package, Snowflake } from "lucide-react";

type RewardStatus = "notified" | "received" | "rewarded" | "digital";

interface RewardPrizeCardProps {
    status: RewardStatus;
}

export default function RewardPrizeCard({ status }: RewardPrizeCardProps) {
    const isReceived = status === "received";
    const isRewarded = status === "rewarded";
    const isDigital = status === "digital";

    return (
        <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
            <div className="flex items-start justify-between gap-5">
                <div className="flex items-center gap-5">
                    <div
                        className={`flex size-20 items-center justify-center rounded-[1.7rem] ${isDigital
                                ? "bg-[#75FF75] text-secondary"
                                : "bg-[#DDF3F0] text-secondary"
                            }`}
                    >
                        {isDigital ? (
                            <Snowflake className="size-9" />
                        ) : (
                            <Package className="size-9" />
                        )}
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-black/90">
                            {isDigital ? "3-Day Streak Freeze" : "Apple iPad Pro"}
                        </h2>

                        {!isDigital && (
                            <p className="mt-2 text-lg text-black/55">
                                Awarded Oct 24, 2023
                            </p>
                        )}
                    </div>
                </div>

                <div className="text-right">
                    {isDigital ? (
                        <>
                            <p className="text-sm font-bold uppercase text-black/60">
                                Awarded On
                            </p>
                            <p className="text-xl font-bold text-black/90">Oct 24, 2023</p>
                        </>
                    ) : (
                        <>
                            <span
                                className={`rounded-full px-5 py-2 text-sm font-bold uppercase ${isRewarded
                                        ? "bg-secondary text-white"
                                        : isReceived
                                            ? "bg-[#DDEBFF] text-[#4E7DF5]"
                                            : "bg-[#EEF3EC] text-black/55"
                                    }`}
                            >
                                {isRewarded
                                    ? "Rewarded"
                                    : isReceived
                                        ? "Address Received"
                                        : "Notified"}
                            </span>

                            <p className="mt-3 text-sm text-black/45">
                                {isRewarded
                                    ? "Process completed Oct 26"
                                    : isReceived
                                        ? "Received 2 days ago"
                                        : "Request sent 2 days ago"}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}