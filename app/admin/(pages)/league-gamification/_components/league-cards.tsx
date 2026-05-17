import { Shield } from "lucide-react";
import { leagueCards } from "../../../../../mock/league-gamification/league-gamification.mock";

export default function LeagueCards() {
    return (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {leagueCards.map((league) => (
                <div
                    key={league.name}
                    className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5"
                >
                    <div
                        className={`mx-auto flex size-24 items-center justify-center rounded-full text-white shadow-lg ${league.colorClass}`}
                    >
                        <Shield className="size-11 fill-current" />
                    </div>

                    <h3 className="mt-5 text-center text-lg font-semibold text-secondary">
                        {league.name}
                    </h3>

                    <div className="mt-6">
                        <p className="text-center text-sm font-semibold text-black/55">
                            XP Threshold to Enter
                        </p>

                        <div className="mt-3 rounded-full bg-[#E8ECE4] py-3 text-center text-lg font-medium text-black/75">
                            {league.threshold}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}