import type {
  LeagueKey,
  LeaderboardRewardStatus,
  LeaderboardRewardType,
  LeaderboardSortOrder,
  RewardHistorySortBy,
} from "@/types/leaderboard/leaderboard.type";

import RewardHistoryClient from "./_components/reward-history-client";

interface RewardHistoryPageProps {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    status?: string | string[];
    rewardType?: string | string[];
    league?: string | string[];
    dateFrom?: string | string[];
    dateTo?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPositiveInteger = (value?: string | string[]) => {
  const numberValue = Number(getSingleValue(value));

  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : 1;
};

const rewardStatuses: LeaderboardRewardStatus[] = [
  "pending",
  "notified",
  "opened",
  "address_pending",
  "address_received",
  "approved",
  "processing",
  "dispatched",
  "delivered",
  "issued",
  "claimed",
  "revoked",
  "cancelled",
  "failed",
];

const rewardTypes: LeaderboardRewardType[] = [
  "physical_gift",
  "physical_prize",
  "streak_freeze",
  "cv_credits",
  "ai_package",
  "xp",
  "course_access",
  "downloadable_file",
  "certificate",
  "badge",
];

const leagues: LeagueKey[] = ["bronze", "silver", "gold", "diamond"];

const parseStatus = (
  value?: string | string[],
): LeaderboardRewardStatus | undefined => {
  const status = getSingleValue(value) as LeaderboardRewardStatus;

  return rewardStatuses.includes(status) ? status : undefined;
};

const parseRewardType = (
  value?: string | string[],
): LeaderboardRewardType | undefined => {
  const rewardType = getSingleValue(value) as LeaderboardRewardType;

  return rewardTypes.includes(rewardType) ? rewardType : undefined;
};

const parseLeague = (value?: string | string[]): LeagueKey | undefined => {
  const league = getSingleValue(value) as LeagueKey;

  return leagues.includes(league) ? league : undefined;
};

const parseSortBy = (value?: string | string[]): RewardHistorySortBy => {
  const sortBy = getSingleValue(value);

  if (
    sortBy === "title" ||
    sortBy === "status" ||
    sortBy === "rewardType" ||
    sortBy === "recipient"
  ) {
    return sortBy;
  }

  return "createdAt";
};

const parseSortOrder = (value?: string | string[]): LeaderboardSortOrder => {
  return getSingleValue(value) === "ASC" ? "ASC" : "DESC";
};

export default async function RewardHistoryPage({
  searchParams,
}: RewardHistoryPageProps) {
  const params = await searchParams;

  return (
    <RewardHistoryClient
      page={getPositiveInteger(params.page)}
      search={getSingleValue(params.search)}
      status={parseStatus(params.status)}
      rewardType={parseRewardType(params.rewardType)}
      league={parseLeague(params.league)}
      dateFrom={getSingleValue(params.dateFrom)}
      dateTo={getSingleValue(params.dateTo)}
      sortBy={parseSortBy(params.sortBy)}
      sortOrder={parseSortOrder(params.sortOrder)}
    />
  );
}
