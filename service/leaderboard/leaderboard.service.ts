import { serviceClient } from "@/service/base/service_client";
import type {
  AdminLeaderboardDashboard,
  AdminLeaderboardQuery,
  CreateLeaderboardRewardPayload,
  CreateLeaderboardRewardResponse,
  DispatchRewardPayload,
  LeaderboardActionResponse,
  LeaderboardRewardDetail,
  LeaderboardRewardSummary,
  RewardConfigurationResponse,
  RewardHistoryListResponse,
  RewardHistoryQuery,
  SendRewardUpdatePayload,
  UpdateRewardShippingAddressPayload,
  UpdateRewardStatusPayload,
} from "@/types/leaderboard/leaderboard.type";
import { assertValidUuid } from "@/utils/uuid";

const ADMIN_LEADERBOARD_ENDPOINT = "/admin/leaderboard";

type QueryValue = string | number | boolean | undefined | null;

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

export const getAdminLeaderboard = async (
  query: AdminLeaderboardQuery = {},
) => {
  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,
    search: query.search?.trim(),
    league: query.league,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<AdminLeaderboardDashboard>(
    `${ADMIN_LEADERBOARD_ENDPOINT}${queryString}`,
  );
};

export const exportAdminLeaderboardCsv = async (
  query: Omit<AdminLeaderboardQuery, "page" | "limit"> = {},
) => {
  const queryString = buildQueryString({
    search: query.search?.trim(),
    league: query.league,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<string>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/export${queryString}`,
  );
};

export const getLeaderboardRewardConfiguration = async (userId: string) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  return serviceClient.get<RewardConfigurationResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/users/${safeUserId}/reward-configuration`,
  );
};

export const createLeaderboardReward = async (
  userId: string,
  payload: CreateLeaderboardRewardPayload,
) => {
  const safeUserId = assertValidUuid(userId, "User ID");

  return serviceClient.post<CreateLeaderboardRewardResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/users/${safeUserId}/rewards`,
    payload,
  );
};

export const getLeaderboardRewardSummary = async () => {
  return serviceClient.get<LeaderboardRewardSummary>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/summary`,
  );
};

export const getLeaderboardRewardHistory = async (
  query: RewardHistoryQuery = {},
) => {
  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,
    search: query.search?.trim(),

    status: query.status,
    rewardType: query.rewardType,
    league: query.league,

    dateFrom: query.dateFrom,
    dateTo: query.dateTo,

    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<RewardHistoryListResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards${queryString}`,
  );
};

export const getLeaderboardRewardById = async (rewardId: string) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.get<LeaderboardRewardDetail>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}`,
  );
};

export const updateLeaderboardRewardStatus = async (
  rewardId: string,
  payload: UpdateRewardStatusPayload,
) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.patch<LeaderboardActionResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}/status`,
    payload,
  );
};

export const requestLeaderboardRewardAddress = async (rewardId: string) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.post<LeaderboardActionResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}/request-address`,
  );
};

export const sendLeaderboardRewardUpdate = async (
  rewardId: string,
  payload: SendRewardUpdatePayload,
) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.post<LeaderboardActionResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}/send-update`,
    payload,
  );
};

export const updateLeaderboardRewardAddress = async (
  rewardId: string,
  payload: UpdateRewardShippingAddressPayload,
) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.put<LeaderboardActionResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}/shipping-address`,
    payload,
  );
};

export const dispatchLeaderboardReward = async (
  rewardId: string,
  payload: DispatchRewardPayload,
) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.post<LeaderboardActionResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}/dispatch`,
    payload,
  );
};

export const markLeaderboardRewardDelivered = async (rewardId: string) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.post<LeaderboardActionResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}/deliver`,
  );
};

export const revokeLeaderboardReward = async (rewardId: string) => {
  const safeRewardId = assertValidUuid(rewardId, "Reward ID");

  return serviceClient.post<LeaderboardActionResponse>(
    `${ADMIN_LEADERBOARD_ENDPOINT}/rewards/${safeRewardId}/revoke`,
  );
};
