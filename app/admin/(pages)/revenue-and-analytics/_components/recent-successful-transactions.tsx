"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ReceiptText, Search } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type {
  RevenueSortOrder,
  RevenueSource,
  RevenueTransactionSortBy,
  RevenueTransactionsResponse,
  RevenueTransactionStatus,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import TransactionStatusBadge from "./transaction-status-badge";

interface RecentSuccessfulTransactionsProps {
  response: RevenueTransactionsResponse | null;

  isLoading: boolean;

  query: {
    search: string;
    source: RevenueSource;
    status: RevenueTransactionStatus;
    sortBy: RevenueTransactionSortBy;
    sortOrder: RevenueSortOrder;
    limit: number;
  };

  onQueryChange: (patch: Record<string, string | number | undefined>) => void;

  onPageChange: (page: number) => void;

  onViewAll: () => void;
  onShowRecent: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const euro = (value: string) => {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value));
};

export default function RecentSuccessfulTransactions({
  response,
  isLoading,
  query,
  onQueryChange,
  onPageChange,
  onViewAll,
  onShowRecent,
}: RecentSuccessfulTransactionsProps) {
  const [searchValue, setSearchValue] = useState(query.search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchValue.trim() !== query.search) {
        onQueryChange({
          search: searchValue.trim(),
        });
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [onQueryChange, query.search, searchValue]);

  const expanded = query.limit > 5;

  const startItem = response?.meta.total
    ? (response.meta.page - 1) * response.meta.limit + 1
    : 0;

  const endItem = Math.min(
    (response?.meta.page || 1) * (response?.meta.limit || 0),

    response?.meta.total || 0,
  );

  return (
    <Card rounded="3xl" padding="lg" shadow="sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF6EF]">
            <ReceiptText className="size-5 text-[#006B3F]" />
          </div>

          <h2 className="text-2xl font-bold text-[#202420]">
            Recent Successful Transactions
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex h-10 min-w-[230px] items-center gap-2 rounded-full bg-[#EEF2EC] px-4">
            <Search className="size-4 text-[#7A847B]" />

            <input
              type="search"
              value={searchValue}
              placeholder="Search transactions..."
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full bg-transparent text-xs outline-none"
            />
          </div>

          <select
            value={query.source}
            onChange={(event) =>
              onQueryChange({
                source: event.target.value,
              })
            }
            className="h-10 rounded-full bg-[#EEF2EC] px-4 text-xs outline-none"
          >
            <option value="all">All Sources</option>

            <option value="course">Courses</option>

            <option value="package">Packages</option>
          </select>

          <select
            value={query.status}
            onChange={(event) =>
              onQueryChange({
                status: event.target.value,
              })
            }
            className="h-10 rounded-full bg-[#EEF2EC] px-4 text-xs outline-none"
          >
            <option value="all">All Statuses</option>

            <option value="successful">Successful</option>

            <option value="refunded">Refunded</option>
          </select>

          <select
            value={query.sortBy}
            onChange={(event) =>
              onQueryChange({
                sortBy: event.target.value,
              })
            }
            className="h-10 rounded-full bg-[#EEF2EC] px-4 text-xs outline-none"
          >
            <option value="transactionAt">Transaction Date</option>

            <option value="amount">Amount</option>

            <option value="orderNumber">Order Number</option>

            <option value="userName">User Name</option>

            <option value="itemName">Item Name</option>
          </select>

          <select
            value={query.sortOrder}
            onChange={(event) =>
              onQueryChange({
                sortOrder: event.target.value,
              })
            }
            className="h-10 rounded-full bg-[#EEF2EC] px-4 text-xs outline-none"
          >
            <option value="DESC">Descending</option>

            <option value="ASC">Ascending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-y-5">
          <thead>
            <tr>
              {["Order ID", "User", "Item", "Amount", "Date", "Status"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="text-left text-xs font-semibold uppercase text-[#98A29E]"
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {response?.items.map((transaction) => (
              <tr key={`${transaction.source}-${transaction.id}`}>
                <td className="text-sm font-medium text-[#202420]">
                  {transaction.orderNumber}
                </td>

                <td>
                  <div className="flex items-center gap-3">
                    {transaction.user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={transaction.user.avatarUrl}
                        alt={transaction.user.name}
                        className="size-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex size-9 items-center justify-center rounded-full bg-[#EAF6EF] text-xs font-semibold text-[#006B3F]">
                        {getInitials(transaction.user.name)}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-[#202420]">
                        {transaction.user.name}
                      </p>

                      <p className="text-[11px] text-[#98A29E]">
                        {transaction.user.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>

                <td>
                  <p className="text-sm text-[#202420]">
                    {transaction.item.name}
                  </p>

                  <p className="text-[11px] capitalize text-[#98A29E]">
                    {transaction.source}
                  </p>
                </td>

                <td className="text-sm font-semibold text-[#202420]">
                  {euro(transaction.normalizedAmount.amount)}
                </td>

                <td className="text-sm text-[#6F7673]">
                  {formatDate(transaction.transactionAt)}
                </td>

                <td>
                  <TransactionStatusBadge status={transaction.status} />
                </td>
              </tr>
            ))}

            {!response?.items.length && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-sm text-[#98A29E]"
                >
                  No transactions matched the selected search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#6F7673]">
          Showing {startItem} to {endItem} of {response?.meta.total || 0}{" "}
          transactions
        </p>

        <div className="flex items-center gap-2">
          {expanded && (
            <>
              <button
                type="button"
                disabled={!response?.meta.hasPreviousPage || isLoading}
                onClick={() => onPageChange((response?.meta.page || 1) - 1)}
                className="flex size-9 items-center justify-center rounded-full border border-black/15 disabled:opacity-40"
                aria-label="Previous transactions page"
              >
                <ArrowLeft className="size-4" />
              </button>

              <span className="px-3 text-sm font-semibold text-[#202420]">
                Page {response?.meta.page || 1} of{" "}
                {response?.meta.totalPages || 1}
              </span>

              <button
                type="button"
                disabled={!response?.meta.hasNextPage || isLoading}
                onClick={() => onPageChange((response?.meta.page || 1) + 1)}
                className="flex size-9 items-center justify-center rounded-full border border-black/15 disabled:opacity-40"
                aria-label="Next transactions page"
              >
                <ArrowRight className="size-4" />
              </button>
            </>
          )}

          <Button
            variant="ghost"
            className="gap-2 text-[#006B3F] hover:bg-[#F4F7F4]"
            onClick={expanded ? onShowRecent : onViewAll}
          >
            {expanded ? "Show Recent Only" : "View All Transactions"}

            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
