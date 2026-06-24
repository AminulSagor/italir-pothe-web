import { Shield } from "lucide-react";

import type { LeaderboardLeagueCard } from "@/types/leaderboard/leaderboard.type";

interface LeagueCardsProps {
  leagues: LeaderboardLeagueCard[];
}

const leagueColorClasses: Record<string, string> = {
  bronze: "bg-[#B87333] shadow-[#B87333]/25",
  silver: "bg-[#9BA6B2] shadow-[#9BA6B2]/25",
  gold: "bg-[#D2A600] shadow-[#D2A600]/25",
  diamond: "bg-[#4D7DF3] shadow-[#4D7DF3]/25",
};

export default function LeagueCards({ leagues }: LeagueCardsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {leagues.map((league) => (
        <div
          key={league.key}
          className="rounded-[2rem] bg-white p-6 shadow-xl shadow-black/5"
        >
          <div
            className={`mx-auto flex size-24 items-center justify-center rounded-full text-white shadow-lg ${
              leagueColorClasses[league.themeKey] ||
              "bg-secondary shadow-green-900/20"
            }`}
          >
            <Shield className="size-11 fill-current" />
          </div>

          <h3 className="mt-5 text-center text-lg font-semibold text-secondary">
            {league.name}
          </h3>

          <p className="mt-2 text-center text-sm text-black/45">
            {league.totalMembers.toLocaleString()} members
          </p>

          <div className="mt-6">
            <p className="text-center text-sm font-semibold text-black/55">
              XP Threshold to Enter
            </p>

            <div className="mt-3 rounded-full bg-[#E8ECE4] py-3 text-center text-lg font-medium text-black/75">
              {league.rangeLabel}
            </div>
          </div>

          {league.benefit && (
            <p className="mt-4 text-center text-xs font-semibold text-secondary">
              {league.benefit.multiplier}× XP boost for{" "}
              {league.benefit.durationHours} hours
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
