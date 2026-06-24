"use client";

import {
  Award,
  BookOpen,
  Bot,
  Eye,
  FileDown,
  Filter,
  Gift,
  Medal,
  Package,
  Snowflake,
  Star,
  Ticket,
} from "lucide-react";

import type {
  LeaderboardRewardStatus,
  LeaderboardRewardType,
  RewardHistoryListResponse,
} from "@/types/leaderboard/leaderboard.type";

interface RecentRewardLogProps {
  history: RewardHistoryListResponse;
  isLoading: boolean;
  onOpenFilters: () => void;
  onPageChange: (page: number) => void;
  onViewReward: (rewardId: string) => void;
  onGiftAgain: (userId: string) => void;
}

const statusClasses: Record<LeaderboardRewardStatus, string> = {
  pending: "bg-[#EEF3EC] text-black/55",
  notified: "bg-[#FFE7B5] text-[#DB9C1F]",
  opened: "bg-[#FFF3C6] text-[#B98B00]",
  address_pending: "bg-[#FFE7B5] text-[#DB9C1F]",
  address_received: "bg-[#DEE8FF] text-[#5E7EF5]",
  approved: "bg-[#DDF7D7] text-[#56A54A]",
  processing: "bg-[#E9E4FF] text-[#7656C8]",
  dispatched: "bg-[#DFF3FF] text-[#2870B8]",
  delivered: "bg-[#DDF7D7] text-[#56A54A]",
  issued: "bg-[#DDF7D7] text-[#56A54A]",
  claimed: "bg-[#DDF7D7] text-[#56A54A]",
  revoked: "bg-[#FCEBEC] text-[#B42318]",
  cancelled: "bg-[#FCEBEC] text-[#B42318]",
  failed: "bg-[#FCEBEC] text-[#B42318]",
};

const rewardTypeIcon = (rewardType: LeaderboardRewardType) => {
  switch (rewardType) {
    case "physical_gift":
    case "physical_prize":
      return Package;

    case "streak_freeze":
      return Snowflake;

    case "cv_credits":
      return Ticket;

    case "ai_package":
      return Bot;

    case "xp":
      return Star;

    case "course_access":
      return BookOpen;

    case "downloadable_file":
      return FileDown;

    case "certificate":
      return Award;

    case "badge":
      return Medal;
  }
};

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatDate = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const getVisiblePages = (page: number, totalPages: number) => {
  if (totalPages <= 3) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  const start = Math.min(Math.max(1, page - 1), totalPages - 2);

  return [start, start + 1, start + 2];
};

export default function RecentRewardLog({
  history,
  isLoading,
  onOpenFilters,
  onPageChange,
  onViewReward,
  onGiftAgain,
}: RecentRewardLogProps) {
  const startItem =
    history.meta.total === 0
      ? 0
      : (history.meta.page - 1) * history.meta.limit + 1;

  const endItem = Math.min(
    history.meta.page * history.meta.limit,
    history.meta.total,
  );

  const visiblePages = getVisiblePages(
    history.meta.page,
    history.meta.totalPages,
  );

  return (
    <section className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-black/5">
      <div className="flex items-center justify-between border-b border-black/5 px-8 py-7">
        <h2 className="text-2xl font-bold text-black/90">Recent Reward Log</h2>

        <button
          type="button"
          onClick={onOpenFilters}
          className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#EEF3EC]"
          aria-label="Filter reward history"
        >
          <Filter className="size-5 text-black/70" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="bg-[#EEF3EC]">
            <tr className="text-left text-xs font-bold uppercase text-black/45">
              <th className="px-6 py-6">Recipient</th>

              <th className="px-6 py-6">Prize Type</th>

              <th className="px-6 py-6">Dispatch Date</th>

              <th className="px-6 py-6">Shipping Address</th>

              <th className="px-6 py-6">Status</th>

              <th className="px-6 py-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {history.items.map((item) => {
              const Icon = rewardTypeIcon(item.rewardType);

              return (
                <tr
                  key={item.id}
                  className="border-b border-black/8 last:border-none"
                >
                  <td className="px-6 py-7">
                    <div className="flex items-center gap-4">
                      {item.recipient.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.recipient.avatarUrl}
                          alt={item.recipient.displayName}
                          className="size-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-full bg-[#DDF3D9] font-bold text-secondary">
                          {getInitials(item.recipient.displayName)}
                        </div>
                      )}

                      <div>
                        <p className="text-lg font-semibold text-black/85">
                          {item.recipient.displayName}
                        </p>

                        <p className="text-sm text-secondary">
                          {item.recipient.username
                            ? `@${item.recipient.username}`
                            : `${item.leagueKey} league`}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-7">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#F2E8FF] text-[#8E4DE6]">
                        <Icon className="size-5" />
                      </div>

                      <div>
                        <p className="max-w-[180px] text-lg text-black/80">
                          {item.title}
                        </p>

                        {item.primaryAmount !== null && (
                          <p className="mt-1 text-xs text-black/45">
                            {item.primaryAmount} {item.primaryUnit || "units"}
                            {item.secondaryAmount !== null
                              ? ` • ${item.secondaryAmount} ${
                                  item.secondaryUnit || "units"
                                }`
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-7 text-lg text-black/75">
                    {formatDate(item.dispatchDate)}
                  </td>

                  <td className="max-w-[260px] px-6 py-7 text-base text-black/55">
                    {item.shippingAddress || "Not required"}
                  </td>

                  <td className="px-6 py-7">
                    <span
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase ${
                        statusClasses[item.status]
                      }`}
                    >
                      {item.displayStatus}
                    </span>
                  </td>

                  <td className="px-6 py-7">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onViewReward(item.id)}
                        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#EEF3EC]"
                        aria-label={`View ${item.title}`}
                      >
                        <Eye className="size-5 text-black/70" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onGiftAgain(item.recipient.userId)}
                        className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#EEF3EC]"
                        aria-label={`Gift another reward to ${item.recipient.displayName}`}
                      >
                        <Gift className="size-5 text-black/70" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!history.items.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-16 text-center text-black/45"
                >
                  No reward history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 bg-[#EAF5DD] px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-black/50">
          Showing {startItem} to {endItem} of {history.meta.total} entries
        </p>

        {history.meta.totalPages > 1 && (
          <div className="flex items-center gap-5">
            <button
              type="button"
              disabled={history.meta.page <= 1}
              onClick={() => onPageChange(history.meta.page - 1)}
              className="disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              ‹
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`flex size-10 items-center justify-center rounded-full ${
                  pageNumber === history.meta.page
                    ? "bg-secondary text-white"
                    : "text-black/65"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={history.meta.page >= history.meta.totalPages}
              onClick={() => onPageChange(history.meta.page + 1)}
              className="disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
