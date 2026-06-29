"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getRevenueGrowth,
  getRevenueOverview,
  getRevenueTransactions,
} from "@/service/revenue-and-analytics/revenue-and-analytics.service";
import type {
  RevenueDatePreset,
  RevenueGraphRange,
  RevenueGrowthResponse,
  RevenueOverviewResponse,
  RevenueSource,
  RevenueSortOrder,
  RevenueTransactionSortBy,
  RevenueTransactionsResponse,
  RevenueTransactionStatus,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import AnalyticsOverviewCards from "./analytics-overview-cards";
import RecentSuccessfulTransactions from "./recent-successful-transactions";
import RevenueDateRangeToolbar from "./revenue-date-range-toolbar";
import RevenueGrowthChart from "./revenue-growth-chart";

interface RevenueAnalyticsClientProps {
  preset: RevenueDatePreset;
  from: string;
  to: string;
  range: RevenueGraphRange;

  page: number;
  limit: number;

  search: string;
  source: RevenueSource;
  status: RevenueTransactionStatus;

  sortBy: RevenueTransactionSortBy;

  sortOrder: RevenueSortOrder;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load revenue analytics.";
};

export default function RevenueAnalyticsClient(
  props: RevenueAnalyticsClientProps,
) {
  const router = useRouter();
  const pathname = usePathname();

  const [overview, setOverview] = useState<RevenueOverviewResponse | null>(
    null,
  );

  const [growth, setGrowth] = useState<RevenueGrowthResponse | null>(null);

  const [transactions, setTransactions] =
    useState<RevenueTransactionsResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const periodQuery = useMemo(
    () => ({
      preset: props.preset,

      from: props.preset === "custom" ? props.from : undefined,

      to: props.preset === "custom" ? props.to : undefined,
    }),
    [props.from, props.preset, props.to],
  );

  const transactionQuery = useMemo(
    () => ({
      ...periodQuery,

      page: props.page,
      limit: props.limit,

      search: props.search || undefined,

      source: props.source,
      status: props.status,

      sortBy: props.sortBy,
      sortOrder: props.sortOrder,
    }),
    [
      periodQuery,
      props.limit,
      props.page,
      props.search,
      props.sortBy,
      props.sortOrder,
      props.source,
      props.status,
    ],
  );

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const [overviewResponse, growthResponse, transactionResponse] =
        await Promise.all([
          getRevenueOverview(periodQuery),

          getRevenueGrowth({
            range: props.range,
          }),

          getRevenueTransactions(transactionQuery),
        ]);

      setOverview(overviewResponse);

      setGrowth(growthResponse);

      setTransactions(transactionResponse);
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [periodQuery, props.range, transactionQuery]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const updateQuery = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(window.location.search);

      setIsLoading(true);

      Object.entries(patch).forEach(([key, value]) => {
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

  if (isLoading && !overview && !growth && !transactions) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  if (loadError && !overview && !growth && !transactions) {
    return (
      <div className="mx-auto flex min-h-[460px] max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Revenue analytics unavailable
        </h2>

        <p className="mt-3 max-w-lg text-[#66736A]">{loadError}</p>

        <button
          type="button"
          onClick={() => void loadData()}
          className="mt-7 rounded-full bg-[#006B3F] px-8 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#006B3F]">Analytics Overview</h1>

      <RevenueDateRangeToolbar
        key={`${props.preset}-${props.from}-${props.to}`}
        preset={props.preset}
        from={props.from}
        to={props.to}
        onApply={(value) =>
          updateQuery({
            preset: value.preset,
            from: value.from,
            to: value.to,
            page: 1,
          })
        }
      />

      <AnalyticsOverviewCards overview={overview} />

      <RevenueGrowthChart
        growth={growth}
        range={props.range}
        onRangeChange={(range) =>
          updateQuery({
            range,
          })
        }
      />

      <RecentSuccessfulTransactions
        key={`${props.search}-${props.source}-${props.status}-${props.sortBy}-${props.sortOrder}-${props.limit}`}
        response={transactions}
        isLoading={isLoading}
        query={{
          search: props.search,
          source: props.source,
          status: props.status,
          sortBy: props.sortBy,
          sortOrder: props.sortOrder,
          limit: props.limit,
        }}
        onQueryChange={(patch) =>
          updateQuery({
            ...patch,
            page: 1,
          })
        }
        onPageChange={(page) =>
          updateQuery({
            page,
          })
        }
        onViewAll={() =>
          updateQuery({
            limit: 20,
            page: 1,
          })
        }
        onShowRecent={() =>
          updateQuery({
            limit: 5,
            page: 1,
          })
        }
      />
    </div>
  );
}
