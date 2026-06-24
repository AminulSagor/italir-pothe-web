import type {
  StoreOrderSortBy,
  StoreSortOrder,
} from "@/types/package-store/package-store.type";

import PackageStoreContent from "./_components/package-store-content";
import PackageStoreHeader from "./_components/package-store-header";
import PackageStoreStats from "./_components/package-store-stats";
import PackageStoreTabs from "./_components/package-store-tabs";

interface Props {
  searchParams: Promise<{
    tab?: string | string[];
    search?: string | string[];
    page?: string | string[];
    status?: string | string[];
    packageType?: string | string[];
    paymentProvider?: string | string[];
    dateFrom?: string | string[];
    dateTo?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const getPageNumber = (value?: string | string[]) => {
  const page = Number(getSingleValue(value));

  return Number.isInteger(page) && page > 0 ? page : 1;
};

export default async function PackageStorePage({ searchParams }: Props) {
  const params = await searchParams;
  const rawSortBy = getSingleValue(params.sortBy);
  const rawSortOrder = getSingleValue(params.sortOrder);

  const sortBy: StoreOrderSortBy =
    rawSortBy === "totalAmountEur" || rawSortBy === "orderNumber"
      ? rawSortBy
      : "createdAt";
  const sortOrder: StoreSortOrder = rawSortOrder === "ASC" ? "ASC" : "DESC";

  return (
    <section className="space-y-7">
      <PackageStoreHeader />
      <PackageStoreStats />
      <PackageStoreTabs activeTab={getSingleValue(params.tab)} />
      <PackageStoreContent
        activeTab={getSingleValue(params.tab)}
        search={getSingleValue(params.search)}
        page={getPageNumber(params.page)}
        status={getSingleValue(params.status)}
        packageType={getSingleValue(params.packageType)}
        paymentProvider={getSingleValue(params.paymentProvider)}
        dateFrom={getSingleValue(params.dateFrom)}
        dateTo={getSingleValue(params.dateTo)}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </section>
  );
}
