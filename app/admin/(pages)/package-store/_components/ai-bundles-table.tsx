import StorePackagesTable from "./store-packages-table";

interface AiBundlesTableProps {
  search: string;
  page: number;
  status: string;
  provider: string;
}

export default function AiBundlesTable(props: AiBundlesTableProps) {
  return (
    <StorePackagesTable
      {...props}
      packageType="ai_bundle"
      title="Active AI Bundles"
    />
  );
}
