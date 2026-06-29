import type {
  RevenueDatePreset,
  RevenueGraphRange,
  RevenueSource,
  RevenueTransactionSortBy,
  RevenueTransactionStatus,
  RevenueSortOrder,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import RevenueAnalyticsClient from "./_components/revenue-analytics-client";

interface RevenueAndAnalyticsPageProps {
  searchParams: Promise<{
    preset?: string | string[];
    from?: string | string[];
    to?: string | string[];
    range?: string | string[];

    page?: string | string[];
    limit?: string | string[];

    search?: string | string[];
    source?: string | string[];
    status?: string | string[];

    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const one = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const positiveInteger = (value?: string | string[], fallback = 1) => {
  const parsed = Number(one(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const presets: RevenueDatePreset[] = [
  "last_7_days",
  "last_30_days",
  "last_90_days",
  "this_month",
  "this_year",
  "all_time",
  "custom",
];

export default async function RevenueAndAnalyticsPage({
  searchParams,
}: RevenueAndAnalyticsPageProps) {
  const params = await searchParams;

  const presetValue = one(params.preset) as RevenueDatePreset;

  const rangeValue = one(params.range) as RevenueGraphRange;

  const sourceValue = one(params.source) as RevenueSource;

  const statusValue = one(params.status) as RevenueTransactionStatus;

  const sortByValue = one(params.sortBy) as RevenueTransactionSortBy;

  const sortOrderValue = one(params.sortOrder) as RevenueSortOrder;

  return (
    <RevenueAnalyticsClient
      preset={presets.includes(presetValue) ? presetValue : "last_30_days"}
      from={one(params.from)}
      to={one(params.to)}
      range={
        ["day", "week", "month"].includes(rangeValue) ? rangeValue : "week"
      }
      page={positiveInteger(params.page)}
      limit={positiveInteger(params.limit, 5)}
      search={one(params.search)}
      source={
        ["all", "course", "package"].includes(sourceValue) ? sourceValue : "all"
      }
      status={
        ["all", "successful", "refunded"].includes(statusValue)
          ? statusValue
          : "successful"
      }
      sortBy={
        [
          "transactionAt",
          "amount",
          "orderNumber",
          "userName",
          "itemName",
        ].includes(sortByValue)
          ? sortByValue
          : "transactionAt"
      }
      sortOrder={sortOrderValue === "ASC" ? "ASC" : "DESC"}
    />
  );
}
