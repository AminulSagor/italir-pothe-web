import type {
  PackagePerformanceSortBy,
  RevenueDatePreset,
  RevenuePackageStatus,
  RevenuePackageType,
  RevenueSortOrder,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import PackagePerformanceClient from "./_components/package-performance-client";

interface PackagePerformancePageProps {
  searchParams: Promise<{
    preset?: string | string[];
    from?: string | string[];
    to?: string | string[];
    page?: string | string[];
    limit?: string | string[];
    search?: string | string[];
    packageType?: string | string[];
    status?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPositiveInteger = (value?: string | string[], fallback = 1) => {
  const parsed = Number(getSingleValue(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const datePresets: RevenueDatePreset[] = [
  "last_7_days",
  "last_30_days",
  "last_90_days",
  "this_month",
  "this_year",
  "all_time",
  "custom",
];

const packageTypes: RevenuePackageType[] = [
  "ai_bundle",
  "streak_freeze",
  "cv_credit",
];

const packageStatuses: RevenuePackageStatus[] = ["published", "archived"];

const packageSortOptions: PackagePerformanceSortBy[] = [
  "packageName",
  "packageType",
  "sales",
  "revenue",
  "lastSaleAt",
];

export default async function PackagePerformancePage({
  searchParams,
}: PackagePerformancePageProps) {
  const params = await searchParams;

  const presetValue = getSingleValue(params.preset) as RevenueDatePreset;

  const typeValue = getSingleValue(params.packageType) as RevenuePackageType;

  const statusValue = getSingleValue(params.status) as RevenuePackageStatus;

  const sortByValue = getSingleValue(params.sortBy) as PackagePerformanceSortBy;

  const sortOrderValue = getSingleValue(params.sortOrder) as RevenueSortOrder;

  return (
    <PackagePerformanceClient
      preset={datePresets.includes(presetValue) ? presetValue : "last_30_days"}
      from={getSingleValue(params.from)}
      to={getSingleValue(params.to)}
      page={getPositiveInteger(params.page)}
      limit={getPositiveInteger(params.limit, 10)}
      search={getSingleValue(params.search)}
      packageType={packageTypes.includes(typeValue) ? typeValue : undefined}
      status={packageStatuses.includes(statusValue) ? statusValue : undefined}
      sortBy={
        packageSortOptions.includes(sortByValue) ? sortByValue : "revenue"
      }
      sortOrder={sortOrderValue === "ASC" ? "ASC" : "DESC"}
    />
  );
}
