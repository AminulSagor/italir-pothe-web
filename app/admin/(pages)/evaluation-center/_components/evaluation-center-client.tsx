"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getEvaluationQueue } from "@/service/evaluation-center/evaluation-center.service";
import type {
  EvaluationQueueResponse,
  EvaluationQueueSortBy,
  EvaluationQueueSortOrder,
  FinalExamAttemptStatus,
} from "@/types/evaluation-center/evaluation-center.type";

import EvaluationHeader from "./evaluation-header";
import EvaluationStatsGrid from "./evaluation-stats-grid";
import EvaluationTable from "./evaluation-table";
import EvaluationToolbar from "./evaluation-toolbar";

interface EvaluationCenterClientProps {
  page: number;
  search: string;

  status?: FinalExamAttemptStatus;

  level: string;
  courseId: string;
  examTemplateId: string;

  sortBy: EvaluationQueueSortBy;

  sortOrder: EvaluationQueueSortOrder;
}

const PAGE_LIMIT = 10;

const emptyResponse: EvaluationQueueResponse = {
  stats: {
    pending: 0,
    gradedToday: 0,
    gradedTodayGoal: 20,
    averageWaitHours: 0,
    targetWaitHours: 24,
    isWithinTarget: true,
  },

  items: [],

  meta: {
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    from: 0,
    to: 0,
  },

  appliedFilters: {
    search: null,
    level: null,
    status: null,
    courseId: null,
    examTemplateId: null,
    sortBy: "timeInQueue",
    sortOrder: "DESC",
  },
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load the final exam evaluation queue.";
};

export default function EvaluationCenterClient({
  page,
  search,
  status,
  level,
  courseId,
  examTemplateId,
  sortBy,
  sortOrder,
}: EvaluationCenterClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [response, setResponse] =
    useState<EvaluationQueueResponse>(emptyResponse);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,

      search: search || undefined,

      status,

      level: level || undefined,

      courseId: courseId || undefined,

      examTemplateId: examTemplateId || undefined,

      sortBy,
      sortOrder,
    }),
    [courseId, examTemplateId, level, page, search, sortBy, sortOrder, status],
  );

  const reloadQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const result = await getEvaluationQueue(query);

      setResponse(result);
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    let mounted = true;

    const fetchQueue = async () => {
      try {
        const result = await getEvaluationQueue(query);

        if (!mounted) return;

        setResponse(result);
        setLoadError("");
      } catch (error) {
        if (!mounted) return;

        const message = getErrorMessage(error);

        setLoadError(message);
        toast.error(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchQueue();

    return () => {
      mounted = false;
    };
  }, [query]);

  const updateQuery = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      setIsLoading(true);

      const params = new URLSearchParams(window.location.search);

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

  if (isLoading && response.items.length === 0 && !response.stats.pending) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  if (loadError && response.items.length === 0 && !response.stats.pending) {
    return (
      <div className="mx-auto flex min-h-[460px] max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Evaluation queue unavailable
        </h2>

        <p className="mt-3 max-w-lg text-[#66736A]">{loadError}</p>

        <button
          type="button"
          onClick={() => void reloadQueue()}
          className="mt-7 rounded-full bg-[#006B3F] px-8 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <EvaluationHeader />

      <EvaluationStatsGrid stats={response.stats} />

      <EvaluationToolbar
        key={`${search}-${status || "all"}-${level || "all"}-${sortBy}-${sortOrder}`}
        initialSearchValue={search}
        status={status}
        level={level}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={(value) =>
          updateQuery({
            search: value,
            page: 1,
          })
        }
        onStatusChange={(value) =>
          updateQuery({
            status: value,
            page: 1,
          })
        }
        onLevelChange={(value) =>
          updateQuery({
            level: value,
            page: 1,
          })
        }
        onSortByChange={(value) =>
          updateQuery({
            sortBy: value,
            page: 1,
          })
        }
        onSortOrderChange={(value) =>
          updateQuery({
            sortOrder: value,
            page: 1,
          })
        }
      />

      <EvaluationTable
        response={response}
        isLoading={isLoading}
        onPageChange={(nextPage) =>
          updateQuery({
            page: nextPage,
          })
        }
        onOpenAttempt={(item) => {
          if (item.action.type === "view_result") {
            router.push(
              `/admin/evaluation-center/certification-center?attemptId=${encodeURIComponent(
                item.attemptId,
              )}`,
            );

            return;
          }

          router.push(
            `/admin/evaluation-center/evaluate-student?attemptId=${encodeURIComponent(
              item.attemptId,
            )}`,
          );
        }}
      />
    </section>
  );
}
