import UserDirectoryHeader from "./_components/user-directory-header";
import UserDirectoryTable from "./_components/user-directory-table";
import UserGrowthCard from "./_components/user-growth-card";
import UserStatsGrid from "./_components/user-stats-grid";

export default function UserDirectoryPage() {
    return (
        <div className="mx-auto w-full max-w-[1180px] space-y-8">
            <UserDirectoryHeader />

            <UserStatsGrid />

            <UserGrowthCard />

            <UserDirectoryTable />
        </div>
    );
}