import { ClipboardCheck, Clock3, CircleCheck } from "lucide-react";
import { moderationStats } from "../../../../../mock/reports-moderation/reports-moderation.mock";

export default function ModerationStatsGrid() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {moderationStats.map((stat) => {
                const Icon =
                    stat.label === "Avg. Response"
                        ? Clock3
                        : stat.label === "Resolved Today"
                            ? CircleCheck
                            : ClipboardCheck;

                return (
                    <section
                        key={stat.id}
                        className="flex min-h-[130px] justify-between rounded-[2rem] bg-white p-6 shadow-sm"
                    >
                        <div>
                            <p className="text-sm font-bold uppercase tracking-wide text-black/60">
                                {stat.label}
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-black/90">
                                {stat.value}
                            </h2>

                            <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${stat.tone === "red"
                                    ? "bg-red-50 text-red-600"
                                    : "bg-green-100 text-green-700"
                                    }`}
                            >
                                ↗ {stat.change}
                            </span>
                        </div>

                        <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                            <Icon className="size-5" />
                        </span>
                    </section>
                );
            })}
        </div>
    );
}