"use client";

import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type {
  ModerationReportsResponse,
  ModerationReportStatus,
} from "@/types/reports-moderation/reports-moderation.type";

import type {
  ModerationQueueFilters,
  ModerationStatusFilter,
} from "./reports-moderation-client";

interface QueueDetailsCardProps {
  response: ModerationReportsResponse | null;

  isLoading: boolean;

  page: number;
  search: string;
  status: ModerationStatusFilter;
  reason: string;

  availableReasons: string[];

  onPageChange: (page: number) => void;

  onFiltersApply: (filters: ModerationQueueFilters) => void;

  onRetry: () => void;
}

const statusClass: Record<ModerationReportStatus, string> = {
  pending: "border-orange-200 bg-orange-50 text-orange-700",

  processing: "border-green-300 bg-green-100 text-green-700",

  resolved: "border-transparent bg-black/5 text-black/40",

  banned: "border-red-100 bg-red-50 text-red-700",
};

const getReasonClass = (reason: string) => {
  const value = reason.toLowerCase();

  if (
    value.includes("harassment") ||
    value.includes("hate") ||
    value.includes("threat") ||
    value.includes("violence") ||
    value.includes("sexual")
  ) {
    return "border-red-100 bg-red-50 text-red-700";
  }

  if (value.includes("spam") || value.includes("scam")) {
    return "border-teal-100 bg-teal-50 text-teal-700";
  }

  if (value.includes("privacy") || value.includes("impersonation")) {
    return "border-sky-100 bg-sky-50 text-sky-700";
  }

  return "border-amber-100 bg-amber-50 text-amber-700";
};

const getInitials = (name: string | null) => {
  const normalized = name?.trim() ?? "";

  if (!normalized) {
    return "U";
  }

  return normalized
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

const formatContentType = (value: string) => {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatReportDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      date: value,
      time: "",
    };
  }

  return {
    date: date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),

    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const maximumVisiblePages = 5;

  let start = Math.max(1, currentPage - 2);

  let end = Math.min(totalPages, start + maximumVisiblePages - 1);

  if (end - start + 1 < maximumVisiblePages) {
    start = Math.max(1, end - maximumVisiblePages + 1);
  }

  return Array.from(
    {
      length: Math.max(0, end - start + 1),
    },
    (_, index) => start + index,
  );
};

export default function QueueDetailsCard({
  response,
  isLoading,
  page,
  search,
  status,
  reason,
  availableReasons,
  onPageChange,
  onFiltersApply,
  onRetry,
}: QueueDetailsCardProps) {
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [draftSearch, setDraftSearch] = useState(search);

  const [draftStatus, setDraftStatus] =
    useState<ModerationStatusFilter>(status);

  const [draftReason, setDraftReason] = useState(reason);

  useEffect(() => {
    setDraftSearch(search);
    setDraftStatus(status);
    setDraftReason(reason);
  }, [reason, search, status]);

  const total = response?.meta.total ?? 0;

  const limit = response?.meta.limit ?? 10;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const currentPage = response?.meta.page ?? page;

  const visiblePages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endItem = Math.min(currentPage * limit, total);

  const activeFilterCount = [
    search.trim(),
    status !== "all" ? status : "",
    reason,
  ].filter(Boolean).length;

  return (
    <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-black/90">Queue Details</h2>

          <p className="mt-1 text-sm text-black/45">
            {total.toLocaleString()} total moderation cases
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen((current) => !current)}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#EEF3EC] px-6 text-sm font-bold text-secondary"
        >
          <Filter className="size-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {isFilterOpen && (
        <div className="mx-7 mb-5 rounded-[1.5rem] bg-[#F5FAF3] p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_190px_240px_auto]">
            <label className="flex h-11 items-center gap-3 rounded-full bg-white px-4">
              <Search className="size-4 text-black/35" />

              <input
                type="search"
                value={draftSearch}
                placeholder="Search case or user..."
                onChange={(event) => setDraftSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    onFiltersApply({
                      search: draftSearch,
                      status: draftStatus,
                      reason: draftReason,
                    });

                    setIsFilterOpen(false);
                  }
                }}
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
              />
            </label>

            <select
              value={draftStatus}
              onChange={(event) =>
                setDraftStatus(event.target.value as ModerationStatusFilter)
              }
              className="h-11 rounded-full bg-white px-4 text-sm text-black/70 outline-none"
            >
              <option value="all">All statuses</option>

              <option value="pending">Pending</option>

              <option value="processing">Processing</option>

              <option value="resolved">Resolved</option>

              <option value="banned">Banned</option>
            </select>

            <select
              value={draftReason}
              onChange={(event) => setDraftReason(event.target.value)}
              className="h-11 rounded-full bg-white px-4 text-sm text-black/70 outline-none"
            >
              <option value="">All reasons</option>

              {availableReasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                onFiltersApply({
                  search: draftSearch,
                  status: draftStatus,
                  reason: draftReason,
                });

                setIsFilterOpen(false);
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-6 text-sm font-bold text-white"
            >
              <SlidersHorizontal className="size-4" />
              Apply
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setDraftSearch("");
                setDraftStatus("all");
                setDraftReason("");

                onFiltersApply({
                  search: "",
                  status: "all",
                  reason: "",
                });

                setIsFilterOpen(false);
              }}
              className="mt-4 text-sm font-semibold text-red-600"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <div
        className={`overflow-x-auto px-7 transition-opacity ${
          isLoading ? "opacity-55" : ""
        }`}
      >
        <table className="w-full min-w-[880px]">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-[0.12em] text-black/45">
              <th className="px-4 py-5">Content / User</th>

              <th className="px-4 py-5">Reason</th>

              <th className="px-4 py-5">Reported Date</th>

              <th className="px-4 py-5">Status</th>

              <th className="px-4 py-5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {response?.items.map((item) => {
              const reportedDate = formatReportDate(item.submittedAt);

              return (
                <tr
                  key={item.id}
                  className="border-t border-black/5 first:border-t-0"
                >
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-secondary">
                        {getInitials(item.subjectName)}
                      </span>

                      <div className="min-w-0">
                        <p className="max-w-[230px] truncate font-bold leading-5 text-black/85">
                          {item.subjectName || "Deleted user"}
                        </p>

                        <p className="text-sm leading-5 text-black/45">
                          {formatContentType(item.contentType)}
                        </p>

                        <p className="max-w-[230px] truncate text-sm leading-5 text-black/45">
                          {item.caseNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex max-w-[220px] rounded-full border px-4 py-2 text-sm ${getReasonClass(
                        item.reportReason,
                      )}`}
                    >
                      <span className="truncate">{item.reportReason}</span>
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <p className="font-medium text-black/75">
                      {reportedDate.date}
                    </p>

                    <p className="text-sm text-black/40">{reportedDate.time}</p>
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex rounded-full border px-5 py-1.5 text-xs font-bold uppercase ${
                        statusClass[item.status] ?? statusClass.pending
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/admin/reports-moderation/resolve?caseNumber=${encodeURIComponent(
                            item.caseNumber,
                          )}`,
                        )
                      }
                      className={`rounded-full px-7 py-3 text-sm font-bold transition ${
                        item.status === "resolved" || item.status === "banned"
                          ? "bg-[#EEF3EC] text-black/55 hover:bg-[#E3EAE0]"
                          : "bg-[#75FF33] text-deep-green hover:brightness-95"
                      }`}
                    >
                      {item.status === "resolved" || item.status === "banned"
                        ? "View Outcome"
                        : "Review Evidence"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!isLoading && response && response.items.length === 0 && (
          <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
            <Filter className="size-9 text-black/20" />

            <h3 className="mt-4 font-semibold text-black/70">
              No moderation reports found
            </h3>

            <p className="mt-1 text-sm text-black/40">
              Change the filters or wait for a new report.
            </p>
          </div>
        )}

        {isLoading && !response && (
          <div className="flex min-h-[260px] items-center justify-center">
            <Loader2 className="size-7 animate-spin text-secondary" />
          </div>
        )}

        {!isLoading && !response && (
          <div className="flex min-h-[240px] flex-col items-center justify-center">
            <p className="text-sm text-red-600">
              Moderation reports could not be loaded.
            </p>

            <button
              type="button"
              onClick={onRetry}
              className="mt-4 flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw className="size-4" />
              Retry
            </button>
          </div>
        )}
      </div>

      {response && (
        <div className="mx-7 mb-6 mt-4 flex flex-col gap-4 rounded-[1.5rem] bg-[#EEF3EC] px-6 py-4 text-sm text-black/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {startItem}–{endItem} of {total.toLocaleString()} cases
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
              className="flex size-9 items-center justify-center rounded-full bg-white text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous reports page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange(pageNumber)}
                className={`flex size-9 items-center justify-center rounded-full font-bold ${
                  pageNumber === currentPage
                    ? "bg-secondary text-white"
                    : "bg-transparent text-black/70"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
              className="flex size-9 items-center justify-center rounded-full bg-white text-secondary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next reports page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
