import LeagueCards from "./_components/league-cards";
import RewardHistoryCard from "./_components/reward-history-card";
import TopUsersTable from "./_components/top-users-table";

export default function LeagueGamificationPage() {
    return (
        <div className="space-y-7">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-black/90">
                    League & Gamification Control
                </h1>

                <p className="mt-2 text-base text-black/60">
                    Set up and dispatch physical rewards for top performing students.
                </p>
            </div>

            <LeagueCards />
            <TopUsersTable />
            <RewardHistoryCard />
        </div>
    );
}