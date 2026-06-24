"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  exportAdminLeaderboardCsv,
  getAdminLeaderboard,
} from "@/service/leaderboard/leaderboard.service";
import type {
  AdminLeaderboardDashboard,
  LeagueKey,
  LeaderboardSortBy,
  LeaderboardSortOrder,
} from "@/types/leaderboard/leaderboard.type";

import LeagueCards from "./league-cards";
import RewardHistoryCard from "./reward-history-card";
import TopUsersTable from "./top-users-table";

interface LeagueGamificationClientProps {
  page: number;
  search: string;
  league?: LeagueKey;
  sortBy: LeaderboardSortBy;
  sortOrder: LeaderboardSortOrder;
}

type QueryPatch = {
  page?: number;
  search?: string;
  league?: LeagueKey | "";
  sortBy?: LeaderboardSortBy;
  sortOrder?: LeaderboardSortOrder;
};

const PAGE_LIMIT = 10;

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load leaderboard data.";
};

export default function LeagueGamificationClient({
  page,
  search,
  league,
  sortBy,
  sortOrder,
}: LeagueGamificationClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [dashboard, setDashboard] = useState<AdminLeaderboardDashboard | null>(
    null,
  );

  const [searchValue, setSearchValue] = useState(search);

  const [isLoading, setIsLoading] = useState(true);

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getAdminLeaderboard({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        league,
        sortBy,
        sortOrder,
      });

      setDashboard(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [league, page, search, sortBy, sortOrder]);

  useEffect(() => {
    void loadLeaderboard();
  }, [loadLeaderboard]);

  const updateQuery = useCallback(
    (patch: QueryPatch) => {
      const params = new URLSearchParams(window.location.search);

      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
          return;
        }

        params.set(key, String(value));
      });

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch === search) {
        return;
      }

      updateQuery({
        search: normalizedSearch,
        page: 1,
      });
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search, searchValue, updateQuery]);

  const handleExport = async () => {
    const toastId = toast.loading("Preparing leaderboard export...");

    try {
      setIsExporting(true);

      const csv = await exportAdminLeaderboardCsv({
        search: search || undefined,
        league,
        sortBy,
        sortOrder,
      });

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8",
      });

      const downloadUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = downloadUrl;
      anchor.download = "leaderboard.csv";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(downloadUrl);

      toast.success("Leaderboard exported successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleGiftReward = (userId: string) => {
    router.push(
      `/admin/league-gamification/reward-configuration?userId=${encodeURIComponent(
        userId,
      )}`,
    );
  };

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black/90">
          League & Gamification Control
        </h1>

        <p className="mt-2 text-base text-black/60">
          Review league performance and dispatch rewards to top-performing
          students.
        </p>
      </div>

      {isLoading && !dashboard ? (
        <div className="flex min-h-[420px] items-center justify-center rounded-[2.5rem] bg-white shadow-xl shadow-black/5">
          <Loader2 className="size-8 animate-spin text-secondary" />
        </div>
      ) : dashboard ? (
        <>
          <LeagueCards leagues={dashboard.leagueCards} />

          <TopUsersTable
            users={dashboard.items}
            leagues={dashboard.leagueCards}
            meta={dashboard.meta}
            searchValue={searchValue}
            selectedLeague={league}
            sortBy={sortBy}
            sortOrder={sortOrder}
            isLoading={isLoading}
            isExporting={isExporting}
            onSearchChange={setSearchValue}
            onLeagueChange={(value) =>
              updateQuery({
                league: value,
                page: 1,
              })
            }
            onSortByChange={(value) =>
              updateQuery({
                sortBy: value,
                page: 1,
              })
            }
            onSortOrderChange={(value) =>
              updateQuery({
                sortOrder: value,
                page: 1,
              })
            }
            onPageChange={(nextPage) =>
              updateQuery({
                page: nextPage,
              })
            }
            onExport={handleExport}
            onGiftReward={handleGiftReward}
          />

          <RewardHistoryCard />
        </>
      ) : (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[2.5rem] bg-white text-center shadow-xl shadow-black/5">
          <TriangleAlert className="size-10 text-[#D92D20]" />

          <h2 className="mt-5 text-xl font-bold text-black/85">
            Leaderboard unavailable
          </h2>

          <button
            type="button"
            onClick={() => void loadLeaderboard()}
            className="mt-5 rounded-full bg-secondary px-8 py-3 font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
