"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getLeaderboardRewardHistory,
  getLeaderboardRewardSummary,
} from "@/service/leaderboard/leaderboard.service";
import type {
  LeagueKey,
  LeaderboardRewardStatus,
  LeaderboardRewardSummary,
  LeaderboardRewardType,
  LeaderboardSortOrder,
  RewardHistoryListResponse,
  RewardHistorySortBy,
} from "@/types/leaderboard/leaderboard.type";

import RecentRewardLog from "./recent-reward-log";
import RewardHistoryFilterDialog, {
  type RewardHistoryFilterValues,
} from "./reward-history-filter-dialog";
import RewardHistoryHeader from "./reward-history-header";
import RewardSummaryCard from "./reward-summary-card";

interface RewardHistoryClientProps {
  page: number;
  search: string;
  status?: LeaderboardRewardStatus;
  rewardType?: LeaderboardRewardType;
  league?: LeagueKey;
  dateFrom: string;
  dateTo: string;
  sortBy: RewardHistorySortBy;
  sortOrder: LeaderboardSortOrder;
}

const PAGE_LIMIT = 10;

const emptyHistory: RewardHistoryListResponse = {
  items: [],
  meta: {
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  },
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load reward history.";
};

export default function RewardHistoryClient({
  page,
  search,
  status,
  rewardType,
  league,
  dateFrom,
  dateTo,
  sortBy,
  sortOrder,
}: RewardHistoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [history, setHistory] =
    useState<RewardHistoryListResponse>(emptyHistory);

  const [summary, setSummary] = useState<LeaderboardRewardSummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [loadError, setLoadError] = useState("");

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: search || undefined,
      status,
      rewardType,
      league,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      sortOrder,
    }),
    [
      dateFrom,
      dateTo,
      league,
      page,
      rewardType,
      search,
      sortBy,
      sortOrder,
      status,
    ],
  );

  const reloadRewardHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const [summaryResponse, historyResponse] = await Promise.all([
        getLeaderboardRewardSummary(),
        getLeaderboardRewardHistory(query),
      ]);

      setSummary(summaryResponse);
      setHistory(historyResponse);
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    let mounted = true;

    const fetchRewardHistory = async () => {
      try {
        const [summaryResponse, historyResponse] = await Promise.all([
          getLeaderboardRewardSummary(),
          getLeaderboardRewardHistory(query),
        ]);

        if (!mounted) return;

        setSummary(summaryResponse);
        setHistory(historyResponse);
        setLoadError("");
      } catch (error) {
        if (!mounted) return;

        const message = getErrorMessage(error);

        setLoadError(message);
        toast.error(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchRewardHistory();

    return () => {
      mounted = false;
    };
  }, [query]);

  const updateQuery = useCallback(
    (values: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(window.location.search);

      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const filterValues: RewardHistoryFilterValues = {
    status: status || "",
    rewardType: rewardType || "",
    league: league || "",
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  };

  if (isLoading && !summary && history.items.length === 0) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-secondary" />
      </div>
    );
  }

  if (loadError && !summary && history.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[480px] w-full max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h1 className="mt-5 text-2xl font-bold text-black/85">
          Reward history unavailable
        </h1>

        <p className="mt-3 max-w-lg text-black/55">{loadError}</p>

        <button
          type="button"
          onClick={() => void reloadRewardHistory()}
          className="mt-7 rounded-full bg-secondary px-8 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1180px] space-y-8">
        <RewardHistoryHeader
          key={search || "empty-search"}
          initialSearchValue={search}
          onSearchCommit={(value) =>
            updateQuery({
              search: value,
              page: 1,
            })
          }
        />

        <RewardSummaryCard summary={summary} />

        <RecentRewardLog
          history={history}
          isLoading={isLoading}
          onOpenFilters={() => setIsFilterOpen(true)}
          onPageChange={(nextPage) =>
            updateQuery({
              page: nextPage,
            })
          }
          onViewReward={(rewardId) =>
            router.push(`/admin/league-gamification/reward-history/${rewardId}`)
          }
          onGiftAgain={(userId) =>
            router.push(
              `/admin/league-gamification/reward-configuration?userId=${encodeURIComponent(
                userId,
              )}`,
            )
          }
        />
      </div>

      <RewardHistoryFilterDialog
        key={`${isFilterOpen ? "open" : "closed"}-${JSON.stringify(
          filterValues,
        )}`}
        open={isFilterOpen}
        values={filterValues}
        onClose={() => setIsFilterOpen(false)}
        onApply={(values) => {
          setIsFilterOpen(false);

          updateQuery({
            page: 1,
            status: values.status,
            rewardType: values.rewardType,
            league: values.league,
            dateFrom: values.dateFrom,
            dateTo: values.dateTo,
            sortBy: values.sortBy,
            sortOrder: values.sortOrder,
          });
        }}
      />
    </>
  );
}
