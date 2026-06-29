"use client";

import { useEffect, useState } from "react";
import { Ban, Eye, MessageSquare, Search, ShieldCheck } from "lucide-react";

import type {
  AdminUserAccessFilter,
  AdminUserAccountStatusFilter,
  AdminUserDirectoryItem,
  AdminUserDirectoryResponse,
  AdminUserDirectorySortBy,
  AdminUserSortOrder,
} from "@/types/user-directory/user-directory.type";

interface UserDirectoryTableProps {
  directory: AdminUserDirectoryResponse;
  isLoading: boolean;
  search: string;

  accessTier: AdminUserAccessFilter;

  accountStatus: AdminUserAccountStatusFilter;

  sortBy: AdminUserDirectorySortBy;

  sortOrder: AdminUserSortOrder;

  onSearchChange: (value: string) => void;

  onAccessTierChange: (value: AdminUserAccessFilter) => void;

  onAccountStatusChange: (value: AdminUserAccountStatusFilter) => void;

  onSortByChange: (value: AdminUserDirectorySortBy) => void;

  onSortOrderChange: (value: AdminUserSortOrder) => void;

  onPageChange: (page: number) => void;

  onViewUser: (userId: string) => void;

  onMessageUser: (user: AdminUserDirectoryItem) => void;

  onToggleRestriction: (user: AdminUserDirectoryItem) => void;
}

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
  if (totalPages <= 5) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  const pages: Array<number | "ellipsis-start" | "ellipsis-end"> = [1];

  if (page > 3) {
    pages.push("ellipsis-start");
  }

  const start = Math.max(2, page - 1);

  const end = Math.min(totalPages - 1, page + 1);

  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    pages.push(pageNumber);
  }

  if (page < totalPages - 2) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);

  return pages;
};

export default function UserDirectoryTable({
  directory,
  isLoading,
  search,
  accessTier,
  accountStatus,
  sortBy,
  sortOrder,
  onSearchChange,
  onAccessTierChange,
  onAccountStatusChange,
  onSortByChange,
  onSortOrderChange,
  onPageChange,
  onViewUser,
  onMessageUser,
  onToggleRestriction,
}: UserDirectoryTableProps) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch !== search) {
        onSearchChange(normalizedSearch);
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [onSearchChange, search, searchValue]);

  const visiblePages = getVisiblePages(
    directory.meta.page,
    directory.meta.totalPages,
  );

  const startItem =
    directory.meta.total === 0
      ? 0
      : (directory.meta.page - 1) * directory.meta.limit + 1;

  const endItem = Math.min(
    directory.meta.page * directory.meta.limit,
    directory.meta.total,
  );

  return (
    <section className="rounded-[2.5rem] bg-white shadow-xl shadow-black/5">
      <div className="space-y-7 p-8">
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "All Users",
              value: "all" as const,
            },
            {
              label: "Free",
              value: "free" as const,
            },
            {
              label: "Premium/Pro",
              value: "premium_pro" as const,
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onAccessTierChange(item.value)}
              className={`rounded-full px-7 py-3 text-sm font-semibold ${
                accessTier === item.value
                  ? "bg-secondary text-white"
                  : "bg-[#EEF3EC] text-black/55"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex h-16 items-center gap-4 rounded-full bg-[#EEF3EC] px-6 text-black/35">
          <Search className="size-5" />

          <input
            type="search"
            value={searchValue}
            placeholder="Search user by phone number, email or name"
            onChange={(event) => setSearchValue(event.target.value)}
            className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/35"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={accountStatus}
            onChange={(event) =>
              onAccountStatusChange(
                event.target.value as AdminUserAccountStatusFilter,
              )
            }
            className="h-12 rounded-full bg-[#EEF3EC] px-5 text-sm text-black/65 outline-none"
          >
            <option value="all">All Account Statuses</option>

            <option value="active">Active Accounts</option>

            <option value="restricted">Restricted Accounts</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              onSortByChange(event.target.value as AdminUserDirectorySortBy)
            }
            className="h-12 rounded-full bg-[#EEF3EC] px-5 text-sm text-black/65 outline-none"
          >
            <option value="joinedAt">Sort by Join Date</option>

            <option value="name">Sort by Name</option>

            <option value="accessTier">Sort by Access Tier</option>

            <option value="totalXp">Sort by Total XP</option>

            <option value="lastActivityAt">Sort by Last Activity</option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) =>
              onSortOrderChange(event.target.value as AdminUserSortOrder)
            }
            className="h-12 rounded-full bg-[#EEF3EC] px-5 text-sm text-black/65 outline-none"
          >
            <option value="DESC">Descending</option>

            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px]">
          <thead>
            <tr className="border-y border-black/5 text-left text-sm font-semibold uppercase text-black/35">
              <th className="px-8 py-5">User</th>

              <th className="px-5 py-5">Join Date</th>

              <th className="px-5 py-5">Access</th>

              <th className="px-5 py-5">Status</th>

              <th className="px-5 py-5">XP Total</th>

              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {directory.items.map((user) => (
              <tr key={user.id} className="border-b border-black/5">
                <td className="px-8 py-7">
                  <div className="flex items-center gap-4">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="size-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-full bg-[#E6F2F0] text-lg font-bold text-secondary">
                        {getInitials(user.fullName)}
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-semibold text-black/90">
                        {user.fullName}
                      </h3>

                      <p className="text-sm text-black/45">
                        {user.email || user.phone || "No contact information"}
                      </p>

                      <p className="mt-1 text-xs text-black/35">
                        Last activity: {formatDate(user.lastActivityAt)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-7 text-base text-black/65">
                  {formatDate(user.joinedAt)}
                </td>

                <td className="px-5 py-7">
                  <span
                    className={`rounded-full px-5 py-2 text-sm font-semibold ${
                      user.accessTier === "premium_pro"
                        ? "bg-[#FFF3E7] text-[#D86A00]"
                        : "bg-[#EEF3EC] text-black/55"
                    }`}
                  >
                    {user.accessTier === "premium_pro" ? "Premium/Pro" : "Free"}
                  </span>
                </td>

                <td className="px-5 py-7">
                  <span
                    className={`rounded-full px-5 py-2 text-sm font-semibold ${
                      user.isRestricted
                        ? "bg-[#FCEBEC] text-[#B42318]"
                        : "bg-[#E4F4E5] text-secondary"
                    }`}
                  >
                    • {user.isRestricted ? "Restricted" : "Active"}
                  </span>
                </td>

                <td className="px-5 py-7 text-lg font-semibold text-black/85">
                  {user.totalXp.toLocaleString()}
                </td>

                <td className="px-8 py-7">
                  <div className="flex justify-end gap-4 text-black/65">
                    <button
                      type="button"
                      onClick={() => onViewUser(user.id)}
                      className="transition hover:text-secondary"
                      aria-label={`View ${user.fullName}`}
                    >
                      <Eye className="size-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onMessageUser(user)}
                      className="transition hover:text-secondary"
                      aria-label={`Message ${user.fullName}`}
                    >
                      <MessageSquare className="size-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleRestriction(user)}
                      className={`transition ${
                        user.isRestricted
                          ? "text-secondary hover:text-[#005A35]"
                          : "hover:text-[#B42318]"
                      }`}
                      aria-label={
                        user.isRestricted
                          ? `Unrestrict ${user.fullName}`
                          : `Restrict ${user.fullName}`
                      }
                    >
                      {user.isRestricted ? (
                        <ShieldCheck className="size-5" />
                      ) : (
                        <Ban className="size-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!directory.items.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-16 text-center text-black/45"
                >
                  No users matched the selected search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-5 p-8 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-base text-black/45">
          Showing {startItem}-{endItem} of{" "}
          {directory.meta.total.toLocaleString()} users
        </p>

        {directory.meta.totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!directory.meta.hasPreviousPage}
              onClick={() => onPageChange(directory.meta.page - 1)}
              className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-black/45 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              ‹
            </button>

            {visiblePages.map((pageItem) => {
              if (typeof pageItem !== "number") {
                return (
                  <span key={pageItem} className="px-1 text-black/45">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageItem}
                  type="button"
                  onClick={() => onPageChange(pageItem)}
                  className={`flex size-11 items-center justify-center rounded-full text-lg ${
                    pageItem === directory.meta.page
                      ? "bg-secondary text-white"
                      : "text-black/70"
                  }`}
                >
                  {pageItem}
                </button>
              );
            })}

            <button
              type="button"
              disabled={!directory.meta.hasNextPage}
              onClick={() => onPageChange(directory.meta.page + 1)}
              className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-black/45 disabled:cursor-not-allowed disabled:opacity-40"
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
