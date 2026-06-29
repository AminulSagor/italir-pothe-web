import { serviceClient } from "@/service/base/service_client";
import type {
  AdminUserActivityAnalyticsResponse,
  AdminUserActivityQuery,
  AdminUserCoursesQuery,
  AdminUserCoursesResponse,
  AdminUserDashboardResponse,
  AdminUserDetailsResponse,
  AdminUserDirectoryQuery,
  AdminUserDirectoryResponse,
  AdminUserExamResultsQuery,
  AdminUserExamResultsResponse,
  AdminUserGrowthQuery,
  AdminUserGrowthResponse,
  AdminUserRestrictionResponse,
  DirectChatResponse,
  QuickRestrictUserPayload,
  UpdateAdminUserRestrictionPayload,
} from "@/types/user-directory/user-directory.type";
import { assertValidUuid } from "@/utils/uuid";

const ADMIN_USERS_ENDPOINT = "/admin/users";

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

export const getAdminUserDashboard = async () => {
  return serviceClient.get<AdminUserDashboardResponse>(
    `${ADMIN_USERS_ENDPOINT}/dashboard`,
  );
};

export const getAdminUserGrowth = async (query: AdminUserGrowthQuery = {}) => {
  const queryString = buildQueryString({
    range: query.range,
  });

  return serviceClient.get<AdminUserGrowthResponse>(
    `${ADMIN_USERS_ENDPOINT}/growth${queryString}`,
  );
};

export const getAdminUsers = async (query: AdminUserDirectoryQuery = {}) => {
  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,
    search: query.search?.trim(),
    accessTier: query.accessTier,
    accountStatus: query.accountStatus,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<AdminUserDirectoryResponse>(
    `${ADMIN_USERS_ENDPOINT}${queryString}`,
  );
};

export const getAdminUserDetails = async (userId: string) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  return serviceClient.get<AdminUserDetailsResponse>(
    `${ADMIN_USERS_ENDPOINT}/${safeUserId}`,
  );
};

export const getAdminUserExamResults = async (
  userId: string,
  query: AdminUserExamResultsQuery = {},
) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,
    search: query.search?.trim(),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<AdminUserExamResultsResponse>(
    `${ADMIN_USERS_ENDPOINT}/${safeUserId}/exam-results${queryString}`,
  );
};

export const getAdminUserCourses = async (
  userId: string,
  query: AdminUserCoursesQuery = {},
) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,
    search: query.search?.trim(),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<AdminUserCoursesResponse>(
    `${ADMIN_USERS_ENDPOINT}/${safeUserId}/courses${queryString}`,
  );
};

export const getAdminUserActivity = async (
  userId: string,
  query: AdminUserActivityQuery = {},
) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  const queryString = buildQueryString({
    days: query.days,
  });

  return serviceClient.get<AdminUserActivityAnalyticsResponse>(
    `${ADMIN_USERS_ENDPOINT}/${safeUserId}/activity${queryString}`,
  );
};

export const updateAdminUserRestriction = async (
  userId: string,
  payload: UpdateAdminUserRestrictionPayload,
) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  return serviceClient.patch<AdminUserRestrictionResponse>(
    `${ADMIN_USERS_ENDPOINT}/${safeUserId}/restriction`,
    payload,
  );
};

export const quickRestrictAdminUser = async (
  payload: QuickRestrictUserPayload,
) => {
  return serviceClient.post<AdminUserRestrictionResponse>(
    `${ADMIN_USERS_ENDPOINT}/quick-ban`,
    payload,
  );
};

export const createDirectChat = async (userId: string) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  return serviceClient.post<DirectChatResponse>("/chat/direct", {
    otherUserId: safeUserId,
  });
};
