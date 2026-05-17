import { TrendingUp } from "lucide-react";
import { userStats } from "../../../../../mock/user-directory/user-directory.mock";

export default function UserStatsGrid() {
    return (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {userStats.map((item) => (
                <div
                    key={item.label}
                    className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5"
                >
                    <p className="text-sm font-semibold uppercase text-black/35">
                        {item.label}
                    </p>

                    <div className="mt-4 flex items-end justify-between gap-3">
                        <h2 className="text-[2rem] font-bold text-black/90">
                            {item.value}
                        </h2>

                        <div className="flex items-center gap-1 text-sm font-semibold text-secondary">
                            <TrendingUp className="size-4" />
                            {item.meta}
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}