import StorePackagesTable from "./store-packages-table";

interface StreakFreezesTableProps {
  search: string;
  page: number;
  status: string;
}

export default function StreakFreezesTable(props: StreakFreezesTableProps) {
  return (
    <StorePackagesTable
      {...props}
      packageType="streak_freeze"
      title="Streak Freeze Packages"
      description="Active inventory for in app microtransactions."
    />
  );
}
