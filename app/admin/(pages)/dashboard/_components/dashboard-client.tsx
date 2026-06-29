"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  exportAdminDashboardOrdersCsv,
  getAdminDashboardOrders,
  getAdminDashboardOverview,
  getAdminDashboardRecentPurchases,
  getAdminDashboardRevenueGrowth,
} from "@/service/admin-dashboard/admin-dashboard.service";
import type {
  AdminDashboardOverviewResponse,
  DashboardOrderSortBy,
  DashboardOrderSource,
  DashboardOrderStatus,
  DashboardOrdersResponse,
  DashboardOrdersView,
  DashboardRecentPurchasesResponse,
  DashboardRevenueGrowthResponse,
  DashboardRevenueRange,
  DashboardSortOrder,
} from "@/types/admin-dashboard/admin-dashboard.type";

import DashboardStats from "./dashboard-stats";
import RecentPurchasesCard from "./recent-purchases-card";
import RevenueGrowthCard from "./revenue-growth-card";

interface DashboardClientProps {
  range: DashboardRevenueRange;
  view: DashboardOrdersView;
  page: number;
  limit: number;
  search: string;
  status: DashboardOrderStatus;
  source: DashboardOrderSource;
  sortBy: DashboardOrderSortBy;
  sortOrder: DashboardSortOrder;
  from: string;
  to: string;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load dashboard information.";
};

const downloadCsv = (csv: string, filename: string) => {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
};

export default function DashboardClient({
  range,
  view,
  page,
  limit,
  search,
  status,
  source,
  sortBy,
  sortOrder,
  from,
  to,
}: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [overview, setOverview] =
    useState<AdminDashboardOverviewResponse | null>(null);

  const [growth, setGrowth] = useState<DashboardRevenueGrowthResponse | null>(
    null,
  );

  const [recentPurchases, setRecentPurchases] =
    useState<DashboardRecentPurchasesResponse | null>(null);

  const [orders, setOrders] = useState<DashboardOrdersResponse | null>(null);

  const [isOverviewLoading, setIsOverviewLoading] = useState(true);

  const [isGrowthLoading, setIsGrowthLoading] = useState(true);

  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const [isExporting, setIsExporting] = useState(false);

  const [loadError, setLoadError] = useState("");

  const orderQuery = useMemo(
    () => ({
      page,
      limit,

      search: search || undefined,

      status,
      source,
      sortBy,
      sortOrder,

      from: from || undefined,
      to: to || undefined,
    }),
    [from, limit, page, search, sortBy, sortOrder, source, status, to],
  );

  const updateQuery = useCallback(
    (
      patch: Record<string, string | number | undefined>,

      options?: {
        resetPage?: boolean;
      },
    ) => {
      const params = new URLSearchParams(window.location.search);

      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "recent") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      if (options?.resetPage) {
        params.delete("page");
      }

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const reloadOverview = useCallback(async () => {
    try {
      setIsOverviewLoading(true);

      const response = await getAdminDashboardOverview();

      setOverview(response);
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsOverviewLoading(false);
    }
  }, []);

  const reloadGrowth = useCallback(async () => {
    try {
      setIsGrowthLoading(true);

      const response = await getAdminDashboardRevenueGrowth(range);

      setGrowth(response);
      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsGrowthLoading(false);
    }
  }, [range]);

  const reloadPurchases = useCallback(async () => {
    try {
      setIsOrdersLoading(true);

      if (view === "all") {
        const response = await getAdminDashboardOrders(orderQuery);

        setOrders(response);
      } else {
        const response = await getAdminDashboardRecentPurchases();

        setRecentPurchases(response);
      }

      setLoadError("");
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsOrdersLoading(false);
    }
  }, [orderQuery, view]);

  useEffect(() => {
    void reloadOverview();
  }, [reloadOverview]);

  useEffect(() => {
    void reloadGrowth();
  }, [reloadGrowth]);

  useEffect(() => {
    void reloadPurchases();
  }, [reloadPurchases]);

  const handleExport = async () => {
    const toastId = toast.loading("Preparing dashboard orders CSV...");

    try {
      setIsExporting(true);

      const csv = await exportAdminDashboardOrdersCsv(
        view === "all"
          ? {
              search: search || undefined,

              status,
              source,
              sortBy,
              sortOrder,

              from: from || undefined,

              to: to || undefined,
            }
          : {
              status: "completed",

              source: "all",

              sortBy: "orderDate",

              sortOrder: "DESC",
            },
      );

      downloadCsv(csv, "dashboard-orders.csv");

      toast.success("Dashboard orders CSV downloaded.", {
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

  const isInitialLoading =
    (isOverviewLoading && !overview) ||
    (isGrowthLoading && !growth) ||
    (isOrdersLoading && (view === "all" ? !orders : !recentPurchases));

  if (isInitialLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  if (loadError && !overview && !growth && !recentPurchases && !orders) {
    return (
      <div className="mx-auto flex min-h-[460px] max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Dashboard unavailable
        </h2>

        <p className="mt-3 max-w-lg text-[#66736A]">{loadError}</p>

        <button
          type="button"
          onClick={() => {
            void reloadOverview();
            void reloadGrowth();
            void reloadPurchases();
          }}
          className="mt-7 rounded-full bg-[#006B3F] px-8 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <DashboardStats overview={overview} />

      <RevenueGrowthCard
        growth={growth}
        range={range}
        isLoading={isGrowthLoading}
        onRangeChange={(nextRange) =>
          updateQuery({
            range: nextRange,
          })
        }
      />

      <RecentPurchasesCard
        key={`${view}-${search}-${status}-${source}-${sortBy}-${sortOrder}-${from}-${to}-${limit}`}
        view={view}
        recentResponse={recentPurchases}
        ordersResponse={orders}
        isLoading={isOrdersLoading}
        isExporting={isExporting}
        query={{
          search,
          status,
          source,
          sortBy,
          sortOrder,
          from,
          to,
          limit,
        }}
        onQueryChange={(patch) =>
          updateQuery(patch, {
            resetPage: true,
          })
        }
        onPageChange={(nextPage) =>
          updateQuery({
            page: nextPage,
          })
        }
        onShowAll={() =>
          updateQuery(
            {
              view: "all",
              page: 1,
            },
            {
              resetPage: true,
            },
          )
        }
        onShowRecent={() =>
          updateQuery({
            view: undefined,
            page: undefined,
          })
        }
        onExport={() => void handleExport()}
      />
    </section>
  );
}
