"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  Search,
  Snowflake,
} from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type {
  PackageOverviewResponse,
  PackagePerformanceResponse,
  PackagePerformanceSortBy,
  RevenuePackageStatus,
  RevenuePackageType,
  RevenueSortOrder,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

interface PackagePerformanceTableProps {
  response: PackagePerformanceResponse | null;

  overview: PackageOverviewResponse | null;

  isLoading: boolean;
  isExporting: boolean;

  query: {
    search: string;

    packageType?: RevenuePackageType;

    status?: RevenuePackageStatus;

    sortBy: PackagePerformanceSortBy;

    sortOrder: RevenueSortOrder;
  };

  onQueryChange: (patch: Record<string, string | number | undefined>) => void;

  onPageChange: (page: number) => void;

  onExport: () => void;
}

const packageTypePresentation: Record<
  RevenuePackageType,
  {
    label: string;
    icon: typeof Bot;
    iconBackground: string;
    iconColor: string;
    badgeBackground: string;
    badgeColor: string;
  }
> = {
  ai_bundle: {
    label: "AI Bundle",
    icon: Bot,

    iconBackground: "bg-[#F2E8FF]",

    iconColor: "text-[#8E4DE6]",

    badgeBackground: "bg-[#F2E8FF]",

    badgeColor: "text-[#8E4DE6]",
  },

  streak_freeze: {
    label: "Streak Freeze",
    icon: Snowflake,

    iconBackground: "bg-[#E7F1FF]",

    iconColor: "text-[#3568C0]",

    badgeBackground: "bg-[#E7F1FF]",

    badgeColor: "text-[#3568C0]",
  },

  cv_credit: {
    label: "CV Credit",
    icon: FileText,

    iconBackground: "bg-[#E9FBEF]",

    iconColor: "text-[#006B3F]",

    badgeBackground: "bg-[#E9FBEF]",

    badgeColor: "text-[#007A4D]",
  },
};

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

const formatBillingModel = (value: string | null) => {
  if (!value) {
    return "Billing model not set";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "No sales in selected period";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `Last sale ${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}`;
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

  const start = Math.min(Math.max(1, page - 1), totalPages - 2);

  return [start, start + 1, start + 2];
};

export default function PackagePerformanceTable({
  response,
  overview,
  isLoading,
  isExporting,
  query,
  onQueryChange,
  onPageChange,
  onExport,
}: PackagePerformanceTableProps) {
  const [searchValue, setSearchValue] = useState(query.search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch !== query.search) {
        onQueryChange({
          search: normalizedSearch,
        });
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [onQueryChange, query.search, searchValue]);

  const meta = response?.meta;

  const visiblePages = getVisiblePages(meta?.page || 1, meta?.totalPages || 0);

  const startItem =
    meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;

  const endItem = Math.min(
    (meta?.page || 1) * (meta?.limit || 0),

    meta?.total || 0,
  );

  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="space-y-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-medium text-[#202420]">
              Package Performance Table
            </h2>

            <p className="mt-1 text-sm text-black/45">
              {(overview?.packageCounts.published || 0).toLocaleString()}{" "}
              published of{" "}
              {(overview?.packageCounts.total || 0).toLocaleString()} packages
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={isExporting}
            onClick={onExport}
          >
            {isExporting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Download className="mr-2 size-4" />
            )}
            Export CSV
          </Button>
        </div>

        <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_180px_170px_190px_150px]">
          <div className="flex h-11 items-center gap-3 rounded-full bg-[#EEF3EC] px-5">
            <Search className="size-4 text-black/40" />

            <input
              type="search"
              value={searchValue}
              placeholder="Search packages..."
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/35"
            />
          </div>

          <select
            value={query.packageType || ""}
            onChange={(event) =>
              onQueryChange({
                packageType: event.target.value || undefined,
              })
            }
            className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm text-black/65 outline-none"
          >
            <option value="">All Package Types</option>

            <option value="ai_bundle">AI Bundles</option>

            <option value="streak_freeze">Streak Freezers</option>

            <option value="cv_credit">CV Credits</option>
          </select>

          <select
            value={query.status || ""}
            onChange={(event) =>
              onQueryChange({
                status: event.target.value || undefined,
              })
            }
            className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm text-black/65 outline-none"
          >
            <option value="">All Statuses</option>

            <option value="published">Published</option>

            <option value="archived">Archived</option>
          </select>

          <select
            value={query.sortBy}
            onChange={(event) =>
              onQueryChange({
                sortBy: event.target.value,
              })
            }
            className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm text-black/65 outline-none"
          >
            <option value="revenue">Sort by Revenue</option>

            <option value="sales">Sort by Sales</option>

            <option value="packageName">Sort by Name</option>

            <option value="packageType">Sort by Type</option>

            <option value="lastSaleAt">Sort by Last Sale</option>
          </select>

          <select
            value={query.sortOrder}
            onChange={(event) =>
              onQueryChange({
                sortOrder: event.target.value,
              })
            }
            className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm text-black/65 outline-none"
          >
            <option value="DESC">Descending</option>

            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-[#E9FBEF]">
            <tr className="text-left">
              <th className="px-8 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Package Name
              </th>

              <th className="px-6 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Type
              </th>

              <th className="px-6 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Sales
              </th>

              <th className="px-6 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {response?.items.map((item) => {
              const presentation = packageTypePresentation[item.packageType];

              const Icon = presentation.icon;

              return (
                <tr
                  key={item.packageId}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${presentation.iconBackground}`}
                      >
                        <Icon className={`size-5 ${presentation.iconColor}`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-[#202420]">
                            {item.packageName}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                              item.status === "published"
                                ? "bg-[#E9FBEF] text-[#007A4D]"
                                : "bg-[#EEF3EC] text-black/45"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {item.description && (
                          <p className="mt-1 max-w-[420px] truncate text-sm text-black/45">
                            {item.description}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-black/35">
                          {formatDate(item.lastSaleAt)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${presentation.badgeBackground} ${presentation.badgeColor}`}
                    >
                      {presentation.label}
                    </span>

                    <p className="mt-2 text-xs text-black/40">
                      {formatBillingModel(item.billingModel)}
                    </p>
                  </td>

                  <td className="px-6 py-6 font-bold text-[#202420]">
                    {item.sales.toLocaleString()}
                  </td>

                  <td className="px-6 py-6 font-bold text-[#202420]">
                    {formatCurrency(item.revenueEur)}
                  </td>
                </tr>
              );
            })}

            {!response?.items.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-8 py-16 text-center text-sm text-black/45"
                >
                  No packages matched the selected search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">
          Showing {startItem} to {endItem} of {meta?.total || 0} packages
        </p>

        {Boolean(meta && meta.totalPages > 1) && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!meta?.hasPreviousPage || isLoading}
              onClick={() => onPageChange((meta?.page || 1) - 1)}
              className="flex size-9 items-center justify-center rounded-full border border-black/15 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous package performance page"
            >
              <ChevronLeft className="size-4" />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange(pageNumber)}
                className={`size-9 rounded-full font-semibold ${
                  pageNumber === meta?.page
                    ? "bg-[#006B3F] text-white"
                    : "border border-black/15"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={!meta?.hasNextPage || isLoading}
              onClick={() => onPageChange((meta?.page || 1) + 1)}
              className="flex size-9 items-center justify-center rounded-full border border-black/15 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next package performance page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
