import type {
  StoreOrderSortBy,
  StoreSortOrder,
} from "@/types/package-store/package-store.type";

import AiBundlesTable from "./ai-bundles-table";
import CvCreditsTable from "./cv-credits-table";
import OrderHistoryTable from "./order-history-table";
import StreakFreezesTable from "./streak-freezes-table";

interface PackageStoreContentProps {
  activeTab?: string;
  search: string;
  page: number;
  status: string;
  packageType: string;
  paymentProvider: string;
  provider: string;
  dateFrom: string;
  dateTo: string;
  sortBy: StoreOrderSortBy;
  sortOrder: StoreSortOrder;
}

export default function PackageStoreContent({
  activeTab,
  search,
  page,
  status,
  packageType,
  paymentProvider,
  provider,
  dateFrom,
  dateTo,
  sortBy,
  sortOrder,
}: PackageStoreContentProps) {
  if (activeTab === "streak-freezes") {
    return (
      <StreakFreezesTable
        search={search}
        page={page}
        status={status}
        provider={provider}
      />
    );
  }

  if (activeTab === "cv-credits") {
    return (
      <CvCreditsTable
        search={search}
        page={page}
        status={status}
        provider={provider}
      />
    );
  }

  if (activeTab === "order-history") {
    return (
      <OrderHistoryTable
        search={search}
        page={page}
        packageType={packageType}
        status={status}
        paymentProvider={paymentProvider}
        dateFrom={dateFrom}
        dateTo={dateTo}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    );
  }

  return (
    <AiBundlesTable
      search={search}
      page={page}
      status={status}
      provider={provider}
    />
  );
}
