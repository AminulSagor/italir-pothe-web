"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Search,
} from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type {
  CoursePerformanceResponse,
  CoursePerformanceSortBy,
  RevenueCourseStatus,
  RevenueSortOrder,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

interface MasterSalesTableProps {
  response: CoursePerformanceResponse | null;

  isLoading: boolean;
  isExporting: boolean;

  query: {
    search: string;
    status?: RevenueCourseStatus;

    sortBy: CoursePerformanceSortBy;

    sortOrder: RevenueSortOrder;
  };

  onQueryChange: (patch: Record<string, string | number | undefined>) => void;

  onPageChange: (page: number) => void;

  onExport: () => void;
}

const formatCurrency = (value: string | null) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
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

export default function MasterSalesTable({
  response,
  isLoading,
  isExporting,
  query,
  onQueryChange,
  onPageChange,
  onExport,
}: MasterSalesTableProps) {
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
    <Card padding="none" rounded="3xl" className="overflow-hidden">
      <div className="space-y-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#006B3F]">
              Master Sales Table
            </h2>

            <p className="text-sm text-black/60">
              Real-time enrollment tracking and revenue breakdown.
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

        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_190px_150px]">
          <div className="flex h-11 items-center gap-3 rounded-full bg-[#EEF3EC] px-5">
            <Search className="size-4 text-black/40" />

            <input
              type="search"
              value={searchValue}
              placeholder="Search courses..."
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/35"
            />
          </div>

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

            <option value="draft">Draft</option>

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

            <option value="enrollments">Sort by Enrollments</option>

            <option value="courseName">Sort by Name</option>

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
        <table className="w-full min-w-[720px]">
          <thead className="bg-[#E9FBEF]">
            <tr className="text-left">
              <th className="px-10 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Course Name
              </th>

              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Enrollments
              </th>

              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {response?.items.map((item) => (
              <tr key={item.courseId} className="border-b border-black/5">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#DFF3F4]">
                      <BookOpen className="size-5 text-[#006B3F]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#202420]">
                          {item.courseName}
                        </p>

                        <span className="rounded-full bg-[#EEF3EC] px-2.5 py-1 text-[10px] font-bold uppercase text-black/50">
                          {item.status}
                        </span>

                        <span className="rounded-full bg-[#E9FBEF] px-2.5 py-1 text-[10px] font-bold uppercase text-[#007A4D]">
                          {item.isFree
                            ? "Free"
                            : item.priceEur
                              ? formatCurrency(item.priceEur)
                              : "Paid"}
                        </span>
                      </div>

                      {item.subtitle && (
                        <p className="mt-1 max-w-[440px] truncate text-sm text-black/45">
                          {item.subtitle}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-black/35">
                        {formatDate(item.lastSaleAt)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-6">
                  <p className="font-medium text-[#202420]">
                    {item.enrollments.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-black/40">
                    {item.sales.toLocaleString()} paid sales
                  </p>
                </td>

                <td className="px-6 py-6 font-medium text-[#202420]">
                  {formatCurrency(item.revenueEur)}
                </td>
              </tr>
            ))}

            {!response?.items.length && (
              <tr>
                <td
                  colSpan={3}
                  className="px-8 py-16 text-center text-sm text-black/45"
                >
                  No courses matched the selected search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">
          Showing {startItem} to {endItem} of {meta?.total || 0} courses
        </p>

        {Boolean(meta && meta.totalPages > 1) && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!meta?.hasPreviousPage || isLoading}
              onClick={() => onPageChange((meta?.page || 1) - 1)}
              className="flex size-9 items-center justify-center rounded-full border border-black/15 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous course performance page"
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
              aria-label="Next course performance page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
