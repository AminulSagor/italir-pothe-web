import { serviceClient } from "@/service/base/service_client";
import type {
  CourseOverviewResponse,
  CoursePerformanceQuery,
  CoursePerformanceResponse,
  PackageOverviewResponse,
  PackagePerformanceQuery,
  PackagePerformanceResponse,
  RevenueAnalyticsSearchResponse,
  RevenueDateRangeQuery,
  RevenueGrowthQuery,
  RevenueGrowthResponse,
  RevenueOverviewResponse,
  RevenueTransactionsQuery,
  RevenueTransactionsResponse,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

const BASE_ENDPOINT = "/admin/revenue-analytics";

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

const dateRangeValues = (query: RevenueDateRangeQuery) => ({
  preset: query.preset,
  from: query.from,
  to: query.to,
});

export const getRevenueOverview = async (query: RevenueDateRangeQuery = {}) => {
  return serviceClient.get<RevenueOverviewResponse>(
    `${BASE_ENDPOINT}/overview${buildQueryString(dateRangeValues(query))}`,
  );
};

export const getRevenueGrowth = async (query: RevenueGrowthQuery = {}) => {
  return serviceClient.get<RevenueGrowthResponse>(
    `${BASE_ENDPOINT}/growth${buildQueryString({
      range: query.range,
    })}`,
  );
};

export const getRevenueTransactions = async (
  query: RevenueTransactionsQuery = {},
) => {
  return serviceClient.get<RevenueTransactionsResponse>(
    `${BASE_ENDPOINT}/transactions${buildQueryString({
      ...dateRangeValues(query),

      page: query.page,
      limit: query.limit,

      search: query.search?.trim(),

      source: query.source,
      status: query.status,

      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })}`,
  );
};

export const searchRevenueAnalytics = async (search: string, limit = 5) => {
  const normalizedSearch = search.trim();

  if (!normalizedSearch) {
    throw new Error("Search text is required.");
  }

  return serviceClient.get<RevenueAnalyticsSearchResponse>(
    `${BASE_ENDPOINT}/search${buildQueryString({
      search: normalizedSearch,

      limit,
    })}`,
  );
};

export const getCourseRevenueOverview = async (
  query: RevenueDateRangeQuery = {},
) => {
  return serviceClient.get<CourseOverviewResponse>(
    `${BASE_ENDPOINT}/courses/overview${buildQueryString(
      dateRangeValues(query),
    )}`,
  );
};

export const getCoursePerformance = async (
  query: CoursePerformanceQuery = {},
) => {
  return serviceClient.get<CoursePerformanceResponse>(
    `${BASE_ENDPOINT}/courses${buildQueryString({
      ...dateRangeValues(query),

      page: query.page,
      limit: query.limit,

      search: query.search?.trim(),

      status: query.status,

      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })}`,
  );
};

export const exportCoursePerformanceCsv = async (
  query: CoursePerformanceQuery = {},
) => {
  return serviceClient.get<string>(
    `${BASE_ENDPOINT}/courses/export.csv${buildQueryString({
      ...dateRangeValues(query),

      search: query.search?.trim(),

      status: query.status,

      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })}`,
  );
};

export const getPackageRevenueOverview = async (
  query: RevenueDateRangeQuery = {},
) => {
  return serviceClient.get<PackageOverviewResponse>(
    `${BASE_ENDPOINT}/packages/overview${buildQueryString(
      dateRangeValues(query),
    )}`,
  );
};

export const getPackagePerformance = async (
  query: PackagePerformanceQuery = {},
) => {
  return serviceClient.get<PackagePerformanceResponse>(
    `${BASE_ENDPOINT}/packages${buildQueryString({
      ...dateRangeValues(query),

      page: query.page,
      limit: query.limit,

      search: query.search?.trim(),

      packageType: query.packageType,

      status: query.status,

      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })}`,
  );
};

export const exportPackagePerformanceCsv = async (
  query: PackagePerformanceQuery = {},
) => {
  return serviceClient.get<string>(
    `${BASE_ENDPOINT}/packages/export.csv${buildQueryString({
      ...dateRangeValues(query),

      search: query.search?.trim(),

      packageType: query.packageType,

      status: query.status,

      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    })}`,
  );
};
