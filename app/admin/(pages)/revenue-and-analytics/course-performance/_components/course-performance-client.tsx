"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import RevenueDateRangeToolbar from "../../_components/revenue-date-range-toolbar";
import {
  exportCoursePerformanceCsv,
  getCoursePerformance,
  getCourseRevenueOverview,
} from "@/service/revenue-and-analytics/revenue-and-analytics.service";
import type {
  CourseOverviewResponse,
  CoursePerformanceResponse,
  CoursePerformanceSortBy,
  RevenueCourseStatus,
  RevenueDatePreset,
  RevenueSortOrder,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import CoursePerformanceStats from "./course-performance-stats";
import MasterSalesTable from "./master-sales-table";

interface CoursePerformanceClientProps {
  preset: RevenueDatePreset;
  from: string;
  to: string;
  page: number;
  limit: number;
  search: string;
  status?: RevenueCourseStatus;

  sortBy: CoursePerformanceSortBy;

  sortOrder: RevenueSortOrder;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load course revenue performance.";
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

export default function CoursePerformanceClient({
  preset,
  from,
  to,
  page,
  limit,
  search,
  status,
  sortBy,
  sortOrder,
}: CoursePerformanceClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [overview, setOverview] = useState<CourseOverviewResponse | null>(null);

  const [performance, setPerformance] =
    useState<CoursePerformanceResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isExporting, setIsExporting] = useState(false);

  const [loadError, setLoadError] = useState("");

  const periodQuery = useMemo(
    () => ({
      preset,

      from: preset === "custom" ? from : undefined,

      to: preset === "custom" ? to : undefined,
    }),
    [from, preset, to],
  );

  const listQuery = useMemo(
    () => ({
      ...periodQuery,

      page,
      limit,

      search: search || undefined,

      status,
      sortBy,
      sortOrder,
    }),
    [limit, page, periodQuery, search, sortBy, sortOrder, status],
  );

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const [overviewResponse, performanceResponse] = await Promise.all([
        getCourseRevenueOverview(periodQuery),

        getCoursePerformance(listQuery),
      ]);

      setOverview(overviewResponse);

      setPerformance(performanceResponse);
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [listQuery, periodQuery]);

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

  const handleExport = async () => {
    const toastId = toast.loading("Preparing course performance CSV...");

    try {
      setIsExporting(true);

      const csv = await exportCoursePerformanceCsv({
        ...periodQuery,

        search: search || undefined,

        status,
        sortBy,
        sortOrder,
      });

      downloadCsv(csv, "course-performance.csv");

      toast.success("Course performance CSV downloaded.", {
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

  if (isLoading && !overview && !performance) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  if (loadError && !overview && !performance) {
    return (
      <div className="mx-auto flex min-h-[460px] max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Course performance unavailable
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
    <section className="space-y-7">
      <h1 className="text-3xl font-bold text-[#006B3F]">
        Course Performance Overview
      </h1>

      <RevenueDateRangeToolbar
        key={`${preset}-${from}-${to}`}
        preset={preset}
        from={from}
        to={to}
        onApply={(value) =>
          updateQuery({
            preset: value.preset,
            from: value.from,
            to: value.to,
            page: 1,
          })
        }
      />

      <CoursePerformanceStats overview={overview} />

      <MasterSalesTable
        key={`${search}-${status || "all"}-${sortBy}-${sortOrder}-${limit}`}
        response={performance}
        isLoading={isLoading}
        isExporting={isExporting}
        query={{
          search,
          status,
          sortBy,
          sortOrder,
        }}
        onQueryChange={(patch) =>
          updateQuery({
            ...patch,
            page: 1,
          })
        }
        onPageChange={(nextPage) =>
          updateQuery({
            page: nextPage,
          })
        }
        onExport={() => void handleExport()}
      />
    </section>
  );
}
