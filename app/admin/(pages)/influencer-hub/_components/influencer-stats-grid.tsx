import { influencerStats } from "../../../../../mock/influencer-hub/influencer-hub.mock";
import InfluencerStatCard from "./influencer-stat-card";

export default function InfluencerStatsGrid() {
    return (
        <div className="grid gap-6 xl:grid-cols-3">
            {influencerStats.map((stat) => (
                <InfluencerStatCard key={stat.id} stat={stat} />
            ))}
        </div>
    );
}