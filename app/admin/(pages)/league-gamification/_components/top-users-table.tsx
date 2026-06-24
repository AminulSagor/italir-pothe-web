"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Gift,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import type {
  AdminLeaderboardUser,
  LeaderboardLeagueCard,
  LeaderboardPaginationMeta,
  LeagueKey,
  LeaderboardSortBy,
  LeaderboardSortOrder,
} from "@/types/leaderboard/leaderboard.type";

interface TopUsersTableProps {
  users: AdminLeaderboardUser[];
  leagues: LeaderboardLeagueCard[];
  meta: LeaderboardPaginationMeta;

  searchValue: string;
  selectedLeague?: LeagueKey;
  sortBy: LeaderboardSortBy;
  sortOrder: LeaderboardSortOrder;

  isLoading: boolean;
  isExporting: boolean;

  onSearchChange: (value: string) => void;
  onLeagueChange: (value: LeagueKey | "") => void;
  onSortByChange: (value: LeaderboardSortBy) => void;
  onSortOrderChange: (value: LeaderboardSortOrder) => void;

  onPageChange: (page: number) => void;
  onExport: () => void;
  onGiftReward: (userId: string) => void;
}

const leagueBadgeClasses: Record<LeagueKey, string> = {
  bronze: "bg-[#F4E5D8] text-[#A35B2C]",
  silver: "bg-[#EEF1F5] text-[#707B88]",
  gold: "bg-[#FFF2BF] text-[#B98B00]",
  diamond: "bg-[#E3EBFF] text-[#4D70D8]",
};

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startPage = Math.min(Math.max(1, currentPage - 1), totalPages - 2);

  return [startPage, startPage + 1, startPage + 2];
};

export default function TopUsersTable({
  users,
  leagues,
  meta,
  searchValue,
  selectedLeague,
  sortBy,
  sortOrder,
  isLoading,
  isExporting,
  onSearchChange,
  onLeagueChange,
  onSortByChange,
  onSortOrderChange,
  onPageChange,
  onExport,
  onGiftReward,
}: TopUsersTableProps) {
  const visiblePages = getVisiblePages(meta.page, meta.totalPages);

  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;

  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <section className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-black/5">
      <div className="flex flex-col gap-5 border-b border-black/5 p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#DDF3D9] text-secondary">
              <Gift className="size-5" />
            </div>

            <h2 className="text-lg font-semibold text-black/85">
              Global Leaderboard Users
            </h2>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="flex h-14 items-center gap-3 rounded-full bg-[#EEF3EC] px-5 lg:w-[320px]">
              <Search className="size-5 text-black/40" />

              <input
                type="search"
                value={searchValue}
                placeholder="Search by name or username..."
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-black/35"
              />
            </div>

            <button
              type="button"
              disabled={isExporting}
              onClick={onExport}
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#EEF3EC] px-6 text-sm font-medium text-black/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex h-12 items-center gap-2 rounded-full bg-[#EEF3EC] px-5">
            <SlidersHorizontal className="size-4 text-black/45" />

            <select
              value={selectedLeague || ""}
              onChange={(event) =>
                onLeagueChange(event.target.value as LeagueKey | "")
              }
              className="w-full bg-transparent text-sm text-black/70 outline-none"
            >
              <option value="">All Leagues</option>

              {leagues.map((league) => (
                <option key={league.key} value={league.key}>
                  {league.name}
                </option>
              ))}
            </select>
          </label>

          <select
            value={sortBy}
            onChange={(event) =>
              onSortByChange(event.target.value as LeaderboardSortBy)
            }
            className="h-12 rounded-full bg-[#EEF3EC] px-5 text-sm text-black/70 outline-none"
          >
            <option value="rank">Sort by Rank</option>

            <option value="totalXp">Sort by Total XP</option>

            <option value="displayName">Sort by Name</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) =>
              onSortOrderChange(event.target.value as LeaderboardSortOrder)
            }
            className="h-12 rounded-full bg-[#EEF3EC] px-5 text-sm text-black/70 outline-none"
          >
            <option value="ASC">Ascending</option>

            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-black/5 text-left text-sm font-semibold text-black/45">
              <th className="px-8 py-5">Rank</th>

              <th>User</th>

              <th>Current League</th>

              <th>Total XP</th>

              <th className="pr-8 text-right">Action</th>
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {users.map((user) => (
              <tr key={user.userId} className="border-b border-black/5">
                <td className="px-8 py-6">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full font-semibold ${
                      user.rank === 1
                        ? "bg-[#75FF33] text-secondary"
                        : "bg-[#EEF1EB] text-black/60"
                    }`}
                  >
                    {user.rank}
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-4">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className="size-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-full bg-[#DDF3D9] font-bold text-secondary">
                        {getInitials(user.displayName)}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-black/85">
                        {user.displayName}
                      </p>

                      <p className="text-sm text-black/45">
                        {user.username ? `@${user.username}` : "No username"}
                      </p>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    className={`inline-flex rounded-full px-5 py-2 text-sm font-semibold ${
                      leagueBadgeClasses[user.league.key]
                    }`}
                  >
                    {user.league.name}
                  </span>
                </td>

                <td>
                  <p className="text-xl font-bold text-black/85">
                    {user.totalXp.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {user.streakDays} day streak
                  </p>
                </td>

                <td className="pr-8 text-right">
                  <button
                    type="button"
                    disabled={!user.canGiftReward}
                    onClick={() => onGiftReward(user.userId)}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Gift className="size-4" />
                    Gift Reward
                  </button>
                </td>
              </tr>
            ))}

            {!users.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-16 text-center text-black/45"
                >
                  No leaderboard users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 bg-[#F7FAF5] p-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-black/45">
          Showing {startItem} to {endItem} of {meta.total.toLocaleString()}{" "}
          active members
        </p>

        {meta.totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => onPageChange(meta.page - 1)}
              className="flex size-10 items-center justify-center rounded-full bg-white text-black/45 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`flex size-10 items-center justify-center rounded-full font-medium ${
                  pageNumber === meta.page
                    ? "bg-secondary text-white"
                    : "bg-[#EEF3EC] text-black/60"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange(meta.page + 1)}
              className="flex size-10 items-center justify-center rounded-full bg-white text-black/45 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
