"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Search,
} from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type {
  DashboardOrderItem,
  DashboardOrderSortBy,
  DashboardOrderSource,
  DashboardOrderStatus,
  DashboardOrdersResponse,
  DashboardOrdersView,
  DashboardRecentPurchasesResponse,
  DashboardSortOrder,
} from "@/types/admin-dashboard/admin-dashboard.type";

interface RecentPurchasesCardProps {
  view: DashboardOrdersView;

  recentResponse: DashboardRecentPurchasesResponse | null;

  ordersResponse: DashboardOrdersResponse | null;

  isLoading: boolean;
  isExporting: boolean;

  query: {
    search: string;
    status: DashboardOrderStatus;
    source: DashboardOrderSource;
    sortBy: DashboardOrderSortBy;
    sortOrder: DashboardSortOrder;
    from: string;
    to: string;
    limit: number;
  };

  onQueryChange: (patch: Record<string, string | number | undefined>) => void;

  onPageChange: (page: number) => void;

  onShowAll: () => void;
  onShowRecent: () => void;
  onExport: () => void;
}

const statusClasses: Record<Exclude<DashboardOrderStatus, "all">, string> = {
  pending: "bg-[#FFF3D6] text-[#B77900]",

  processing: "bg-[#E7F1FF] text-[#3568C0]",

  completed: "bg-[#E9FBEF] text-[#007A4D]",

  failed: "bg-[#FCEBEC] text-[#B42318]",

  cancelled: "bg-[#EEF3EC] text-black/55",

  refunded: "bg-[#F2E8FF] text-[#7A46B5]",
};

const formatCurrency = (value: string) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

const formatLabel = (value: string) => {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

export default function RecentPurchasesCard({
  view,
  recentResponse,
  ordersResponse,
  isLoading,
  isExporting,
  query,
  onQueryChange,
  onPageChange,
  onShowAll,
  onShowRecent,
  onExport,
}: RecentPurchasesCardProps) {
  const [searchValue, setSearchValue] = useState(query.search);

  const [fromValue, setFromValue] = useState(query.from);

  const [toValue, setToValue] = useState(query.to);

  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (view !== "all") return;

    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch !== query.search) {
        onQueryChange({
          search: normalizedSearch,
        });
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [onQueryChange, query.search, searchValue, view]);

  const items =
    view === "all" ? ordersResponse?.items || [] : recentResponse?.items || [];

  const meta = ordersResponse?.meta;

  const visiblePages = getVisiblePages(meta?.page || 1, meta?.totalPages || 0);

  const applyDates = () => {
    if (fromValue && toValue && fromValue > toValue) {
      setDateError("From date must be earlier than or equal to the To date.");

      return;
    }

    setDateError("");

    onQueryChange({
      from: fromValue,
      to: toValue,
    });
  };

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-medium text-[#202420]">
            {view === "all" ? "All Orders" : "Recent Purchases"}
          </h2>

          {view === "all" && (
            <p className="mt-1 text-sm text-black/45">
              Search and filter course and package orders.
            </p>
          )}
        </div>

        <div className="flex gap-3">
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

          <Button size="sm" onClick={view === "all" ? onShowRecent : onShowAll}>
            {view === "all" ? "Recent Purchases" : "All Orders"}
          </Button>
        </div>
      </div>

      {view === "all" && (
        <div className="mb-8 space-y-4 rounded-[1.5rem] bg-[#F7FAF7] p-4">
          <div className="grid gap-3 xl:grid-cols-[minmax(240px,1fr)_160px_150px_180px_140px]">
            <div className="flex h-11 items-center gap-3 rounded-full bg-[#EEF3EC] px-5">
              <Search className="size-4 text-black/40" />

              <input
                type="search"
                value={searchValue}
                placeholder="Search order, student, email, or item..."
                onChange={(event) => setSearchValue(event.target.value)}
                className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/35"
              />
            </div>

            <select
              value={query.status}
              onChange={(event) =>
                onQueryChange({
                  status: event.target.value,
                })
              }
              className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm text-black/65 outline-none"
            >
              <option value="all">All Statuses</option>

              <option value="pending">Pending</option>

              <option value="processing">Processing</option>

              <option value="completed">Completed</option>

              <option value="failed">Failed</option>

              <option value="cancelled">Cancelled</option>

              <option value="refunded">Refunded</option>
            </select>

            <select
              value={query.source}
              onChange={(event) =>
                onQueryChange({
                  source: event.target.value,
                })
              }
              className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm text-black/65 outline-none"
            >
              <option value="all">All Sources</option>

              <option value="course">Courses</option>

              <option value="package">Packages</option>
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
              <option value="orderDate">Sort by Order Date</option>

              <option value="amount">Sort by Amount</option>

              <option value="studentName">Sort by Student</option>

              <option value="orderNumber">Sort by Order ID</option>
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

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label>
                <span className="mb-1 block text-xs font-bold uppercase text-black/40">
                  From
                </span>

                <input
                  type="date"
                  value={fromValue}
                  onChange={(event) => setFromValue(event.target.value)}
                  className="h-10 rounded-full bg-[#EEF3EC] px-4 text-sm outline-none"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs font-bold uppercase text-black/40">
                  To
                </span>

                <input
                  type="date"
                  value={toValue}
                  onChange={(event) => setToValue(event.target.value)}
                  className="h-10 rounded-full bg-[#EEF3EC] px-4 text-sm outline-none"
                />
              </label>

              <Button size="sm" onClick={applyDates}>
                Apply Dates
              </Button>

              {(query.from || query.to) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFromValue("");
                    setToValue("");
                    setDateError("");

                    onQueryChange({
                      from: undefined,
                      to: undefined,
                    });
                  }}
                >
                  Clear Dates
                </Button>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm text-black/55">
              Rows
              <select
                value={query.limit}
                onChange={(event) =>
                  onQueryChange({
                    limit: Number(event.target.value),
                  })
                }
                className="h-10 rounded-full bg-[#EEF3EC] px-4 outline-none"
              >
                <option value={10}>10</option>

                <option value={20}>20</option>

                <option value={50}>50</option>

                <option value={100}>100</option>
              </select>
            </label>
          </div>

          {dateError && <p className="text-xs text-[#D92D20]">{dateError}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-black/10 text-left">
              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Order ID
              </th>

              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Student Name
              </th>

              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Item Purchased
              </th>

              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Amount
              </th>

              <th className="pb-5 text-right text-xs font-bold uppercase text-[#3F463F]">
                Status
              </th>
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {items.map((purchase) => (
              <PurchaseRow
                key={`${purchase.source}-${purchase.id}`}
                item={purchase}
              />
            ))}

            {!items.length && (
              <tr>
                <td
                  colSpan={5}
                  className="py-14 text-center text-sm text-black/45"
                >
                  No orders matched the selected search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {view === "all" && meta && (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-black/55">
            Showing {meta.from} to {meta.to} of {meta.total.toLocaleString()}{" "}
            orders
          </p>

          {meta.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!meta.hasPreviousPage || isLoading}
                onClick={() => onPageChange(meta.page - 1)}
                className="flex size-9 items-center justify-center rounded-full border border-black/15 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous orders page"
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
                    pageNumber === meta.page
                      ? "bg-[#006B3F] text-white"
                      : "border border-black/15"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                type="button"
                disabled={!meta.hasNextPage || isLoading}
                onClick={() => onPageChange(meta.page + 1)}
                className="flex size-9 items-center justify-center rounded-full border border-black/15 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next orders page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function PurchaseRow({ item }: { item: DashboardOrderItem }) {
  return (
    <tr>
      <td className="py-5 text-sm font-medium text-[#007A4D]">
        {item.orderNumber}
      </td>

      <td className="py-5">
        <p className="text-sm font-semibold text-[#202420]">
          {item.student.name}
        </p>

        <p className="mt-1 text-xs text-black/40">
          {item.student.email ||
            (item.student.deleted ? "Deleted user" : "No email")}
        </p>
      </td>

      <td className="py-5">
        <p className="text-sm text-[#202420]">{item.item.name}</p>

        <p className="mt-1 text-xs capitalize text-black/40">
          {item.source} • {formatLabel(item.item.type)}
        </p>
      </td>

      <td className="py-5 text-sm text-[#202420]">
        {formatCurrency(item.normalizedAmount.amount)}
      </td>

      <td className="py-5 text-right">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            statusClasses[item.status]
          }`}
        >
          {formatLabel(item.status)}
        </span>
      </td>
    </tr>
  );
}
