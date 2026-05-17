import { BadgeEuro, MousePointerClick, UsersRound } from "lucide-react";
import { InfluencerStat } from "../../../../../mock/influencer-hub/influencer-hub.mock.types";

interface InfluencerStatCardProps {
    stat: InfluencerStat;
}

export default function InfluencerStatCard({ stat }: InfluencerStatCardProps) {
    const Icon =
        stat.tone === "orange"
            ? BadgeEuro
            : stat.tone === "blue"
                ? MousePointerClick
                : UsersRound;

    return (
        <div className="flex min-h-[130px] justify-between rounded-[1.7rem] bg-white p-6 shadow-sm">
            <div>
                <p className="max-w-[170px] text-sm leading-6 text-black/70">
                    {stat.label}
                </p>

                <h2
                    className={`mt-2 text-2xl font-bold ${stat.tone === "orange" ? "text-orange-500" : "text-deep-green"
                        }`}
                >
                    {stat.value}
                </h2>

                <p
                    className={`mt-2 text-sm ${stat.tone === "orange" ? "text-red-500" : "text-green-600"
                        }`}
                >
                    {stat.description}
                </p>
            </div>

            <div
                className={`flex size-11 items-center justify-center rounded-full ${stat.tone === "orange"
                        ? "bg-orange-100 text-orange-500"
                        : stat.tone === "blue"
                            ? "bg-sky-100 text-secondary"
                            : "bg-emerald-100 text-secondary"
                    }`}
            >
                <Icon className="size-5" />
            </div>
        </div>
    );
}