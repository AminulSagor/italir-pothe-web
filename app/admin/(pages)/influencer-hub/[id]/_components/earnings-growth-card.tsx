import { earningsGrowthData } from "../../../../../../mock/influencer-hub/influencer-hub.mock";

export default function EarningsGrowthCard() {
    return (
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-xl font-bold text-black/85">
                    <span className="h-8 w-1.5 rounded-full bg-secondary" />
                    Earnings Growth Trend
                </h2>

                <div className="flex items-center gap-2">
                    <button className="rounded-full bg-[#EEF3EC] px-4 py-2 text-xs font-bold text-black/60">
                        7D
                    </button>
                    <button className="rounded-full bg-secondary px-4 py-2 text-xs font-bold text-white">
                        30D
                    </button>
                    <button className="rounded-full bg-[#EEF3EC] px-4 py-2 text-xs font-bold text-black/60">
                        1Y
                    </button>
                </div>
            </div>

            <div className="mt-8 flex h-[230px] items-end justify-between gap-4 px-5">
                {earningsGrowthData.map((bar) => (
                    <div
                        key={bar.id}
                        className="w-full rounded-t-full bg-emerald-100"
                        style={{ height: `${bar.value}%` }}
                    />
                ))}
            </div>

            <p className="mt-6 text-center text-sm font-bold text-black/80">
                Earning In Euro
            </p>
        </section>
    );
}