import type {
  DashboardOrderSortBy,
  DashboardOrderSource,
  DashboardOrderStatus,
  DashboardOrdersView,
  DashboardRevenueRange,
  DashboardSortOrder,
} from "@/types/admin-dashboard/admin-dashboard.type";

import DashboardClient from "./_components/dashboard-client";

interface DashboardPageProps {
  searchParams: Promise<{
    range?: string | string[];
    view?: string | string[];
    page?: string | string[];
    limit?: string | string[];
    search?: string | string[];
    status?: string | string[];
    source?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
    from?: string | string[];
    to?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPositiveInteger = (value?: string | string[], fallback = 1) => {
  const parsed = Number(getSingleValue(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const parseRevenueRange = (
  value?: string | string[],
): DashboardRevenueRange => {
  const range = getSingleValue(value);

  return range === "daily" || range === "weekly" ? range : "monthly";
};

const parseOrdersView = (value?: string | string[]): DashboardOrdersView => {
  return getSingleValue(value) === "all" ? "all" : "recent";
};

const parseOrderStatus = (value?: string | string[]): DashboardOrderStatus => {
  const status = getSingleValue(value) as DashboardOrderStatus;

  return [
    "all",
    "pending",
    "processing",
    "completed",
    "failed",
    "cancelled",
    "refunded",
  ].includes(status)
    ? status
    : "all";
};

const parseOrderSource = (value?: string | string[]): DashboardOrderSource => {
  const source = getSingleValue(value) as DashboardOrderSource;

  return ["all", "course", "package"].includes(source) ? source : "all";
};

const parseOrderSortBy = (value?: string | string[]): DashboardOrderSortBy => {
  const sortBy = getSingleValue(value) as DashboardOrderSortBy;

  return ["orderDate", "amount", "studentName", "orderNumber"].includes(sortBy)
    ? sortBy
    : "orderDate";
};

const parseSortOrder = (value?: string | string[]): DashboardSortOrder => {
  return getSingleValue(value) === "ASC" ? "ASC" : "DESC";
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  return (
    <DashboardClient
      range={parseRevenueRange(params.range)}
      view={parseOrdersView(params.view)}
      page={getPositiveInteger(params.page)}
      limit={getPositiveInteger(params.limit, 20)}
      search={getSingleValue(params.search)}
      status={parseOrderStatus(params.status)}
      source={parseOrderSource(params.source)}
      sortBy={parseOrderSortBy(params.sortBy)}
      sortOrder={parseSortOrder(params.sortOrder)}
      from={getSingleValue(params.from)}
      to={getSingleValue(params.to)}
    />
  );
}
