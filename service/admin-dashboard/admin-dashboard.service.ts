import { serviceClient } from "@/service/base/service_client";
import type {
  AdminDashboardOverviewResponse,
  DashboardOrdersExportQuery,
  DashboardOrdersQuery,
  DashboardOrdersResponse,
  DashboardRecentPurchasesResponse,
  DashboardRevenueGrowthResponse,
  DashboardRevenueRange,
} from "@/types/admin-dashboard/admin-dashboard.type";

const BASE_ENDPOINT = "/admin/dashboard";

type QueryValue = string | number | undefined | null;

const buildQueryString = (values: Record<string, QueryValue>) => {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
};

export const getAdminDashboardOverview = async () => {
  return serviceClient.get<AdminDashboardOverviewResponse>(
    `${BASE_ENDPOINT}/overview`,
  );
};

export const getAdminDashboardRevenueGrowth = async (
  range: DashboardRevenueRange = "monthly",
) => {
  return serviceClient.get<DashboardRevenueGrowthResponse>(
    `${BASE_ENDPOINT}/revenue-growth${buildQueryString({
      range,
    })}`,
  );
};

export const getAdminDashboardRecentPurchases = async () => {
  return serviceClient.get<DashboardRecentPurchasesResponse>(
    `${BASE_ENDPOINT}/recent-purchases`,
  );
};

export const getAdminDashboardOrders = async (
  query: DashboardOrdersQuery = {},
) => {
  return serviceClient.get<DashboardOrdersResponse>(
    `${BASE_ENDPOINT}/orders${buildQueryString({
      page: query.page,
      limit: query.limit,

      search: query.search?.trim(),

      status: query.status,
      source: query.source,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,

      from: query.from,
      to: query.to,
    })}`,
  );
};

export const exportAdminDashboardOrdersCsv = async (
  query: DashboardOrdersExportQuery = {},
) => {
  return serviceClient.get<string>(
    `${BASE_ENDPOINT}/orders/export.csv${buildQueryString({
      search: query.search?.trim(),

      status: query.status,
      source: query.source,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,

      from: query.from,
      to: query.to,
    })}`,
  );
};
