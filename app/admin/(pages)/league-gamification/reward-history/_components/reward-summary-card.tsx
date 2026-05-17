import { Gift } from "lucide-react";

export default function RewardSummaryCard() {
    return (
        <section className="w-fit rounded-[2rem] bg-white px-8 py-7 shadow-xl shadow-black/5">
            <div className="flex items-center gap-5">
                <div className="flex size-16 items-center justify-center rounded-[1.3rem] bg-[#DDF3E9] text-secondary">
                    <Gift className="size-8" />
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-black/40">
                        Total Rewards Given
                    </p>

                    <div className="flex items-end gap-2">
                        <h2 className="text-2xl font-bold leading-none text-secondary">
                            124
                        </h2>

                        <span className="mb-1 text-lg text-black/50">prizes</span>
                    </div>
                </div>
            </div>
        </section>
    );
}