import StorePackagesTable from "./store-packages-table";

interface CvCreditsTableProps {
  search: string;
  page: number;
  status: string;
  provider: string;
}

export default function CvCreditsTable(props: CvCreditsTableProps) {
  return (
    <StorePackagesTable
      {...props}
      packageType="cv_credit"
      title="CV Credit Packages"
      description="Credit bundles available for CV generation and downloads."
    />
  );
}
