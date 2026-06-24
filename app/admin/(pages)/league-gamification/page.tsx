import type {
  LeagueKey,
  LeaderboardSortBy,
  LeaderboardSortOrder,
} from "@/types/leaderboard/leaderboard.type";

import LeagueGamificationClient from "./_components/league-gamification-client";

interface LeagueGamificationPageProps {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    league?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPositiveInteger = (value?: string | string[], fallback = 1) => {
  const numberValue = Number(getSingleValue(value));

  return Number.isInteger(numberValue) && numberValue > 0
    ? numberValue
    : fallback;
};

const parseLeague = (value?: string | string[]): LeagueKey | undefined => {
  const league = getSingleValue(value);

  if (
    league === "bronze" ||
    league === "silver" ||
    league === "gold" ||
    league === "diamond"
  ) {
    return league;
  }

  return undefined;
};

const parseSortBy = (value?: string | string[]): LeaderboardSortBy => {
  const sortBy = getSingleValue(value);

  if (sortBy === "totalXp" || sortBy === "displayName") {
    return sortBy;
  }

  return "rank";
};

const parseSortOrder = (value?: string | string[]): LeaderboardSortOrder => {
  return getSingleValue(value) === "DESC" ? "DESC" : "ASC";
};

export default async function LeagueGamificationPage({
  searchParams,
}: LeagueGamificationPageProps) {
  const params = await searchParams;

  return (
    <LeagueGamificationClient
      page={getPositiveInteger(params.page)}
      search={getSingleValue(params.search)}
      league={parseLeague(params.league)}
      sortBy={parseSortBy(params.sortBy)}
      sortOrder={parseSortOrder(params.sortOrder)}
    />
  );
}
