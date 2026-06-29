"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAdminUserExamResults } from "@/service/user-directory/user-directory.service";
import type {
  AdminUserExamResultsResponse,
  AdminUserExamSortBy,
  AdminUserSortOrder,
} from "@/types/user-directory/user-directory.type";

interface ExamResultsCardProps {
  userId: string;

  initialResponse: AdminUserExamResultsResponse;
}

const PAGE_LIMIT = 3;

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load exam results.";
};

const formatDate = (value: string | null) => {
  if (!value) {
    return "Completion date unavailable";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export default function ExamResultsCard({
  userId,
  initialResponse,
}: ExamResultsCardProps) {
  const [response, setResponse] =
    useState<AdminUserExamResultsResponse>(initialResponse);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");

  const [sortBy, setSortBy] = useState<AdminUserExamSortBy>("completedAt");

  const [sortOrder, setSortOrder] = useState<AdminUserSortOrder>("DESC");

  const [isLoading, setIsLoading] = useState(false);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;

      return;
    }

    let mounted = true;

    const loadResults = async () => {
      try {
        const result = await getAdminUserExamResults(userId, {
          page,
          limit: PAGE_LIMIT,

          search: appliedSearch || undefined,

          sortBy,
          sortOrder,
        });

        if (mounted) {
          setResponse(result);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadResults();

    return () => {
      mounted = false;
    };
  }, [appliedSearch, page, sortBy, sortOrder, userId]);

  const applySearch = () => {
    const normalizedSearch = search.trim();

    if (page === 1 && normalizedSearch === appliedSearch) {
      return;
    }

    setIsLoading(true);
    setPage(1);
    setAppliedSearch(normalizedSearch);
  };

  return (
    <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
      <div className="mb-7 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <ClipboardList className="size-5" />
        </span>

        <h2 className="text-lg font-semibold text-black/90">Exam Results</h2>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="flex h-11 flex-1 items-center gap-3 rounded-full bg-[#EEF3EC] px-4">
          <Search className="size-4 text-black/35" />

          <input
            value={search}
            placeholder="Search exams..."
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applySearch();
              }
            }}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <button
          type="button"
          onClick={applySearch}
          className="rounded-full bg-secondary px-5 text-sm font-semibold text-white"
        >
          Search
        </button>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <select
          value={sortBy}
          onChange={(event) => {
            setIsLoading(true);
            setPage(1);

            setSortBy(event.target.value as AdminUserExamSortBy);
          }}
          className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm outline-none"
        >
          <option value="completedAt">Completion Date</option>

          <option value="score">Score</option>

          <option value="title">Title</option>
        </select>

        <select
          value={sortOrder}
          onChange={(event) => {
            setIsLoading(true);
            setPage(1);

            setSortOrder(event.target.value as AdminUserSortOrder);
          }}
          className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm outline-none"
        >
          <option value="DESC">Descending</option>

          <option value="ASC">Ascending</option>
        </select>
      </div>

      <div className={`space-y-7 ${isLoading ? "opacity-55" : ""}`}>
        {response.items.map((exam) => (
          <div
            key={exam.attemptId}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#DDF3D9] text-lg font-bold text-secondary">
                {exam.levelLabel || "EX"}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-xl font-medium text-black/90">
                  {exam.title}
                </h3>

                <p className="truncate text-sm text-black/45">
                  {exam.courseTitle} • {formatDate(exam.completedAt)}
                </p>

                <p className="mt-1 text-xs uppercase text-black/35">
                  {exam.verdict} • {exam.status}
                </p>
              </div>
            </div>

            <h3 className="text-[2rem] font-bold text-secondary">
              {exam.scorePercent.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              %
            </h3>
          </div>
        ))}

        {!response.items.length && (
          <p className="py-8 text-center text-sm text-black/40">
            No exam results found.
          </p>
        )}
      </div>

      {response.meta.totalPages > 1 && (
        <div className="mt-7 flex items-center justify-between border-t border-black/5 pt-5">
          <p className="text-xs text-black/40">
            Page {response.meta.page} of {response.meta.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!response.meta.hasPreviousPage || isLoading}
              onClick={() => {
                setIsLoading(true);

                setPage((current) => current - 1);
              }}
              className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-40"
              aria-label="Previous exam-results page"
            >
              <ChevronLeft className="size-4" />
            </button>

            <button
              type="button"
              disabled={!response.meta.hasNextPage || isLoading}
              onClick={() => {
                setIsLoading(true);

                setPage((current) => current + 1);
              }}
              className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-40"
              aria-label="Next exam-results page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="size-4 animate-spin text-secondary" />
        </div>
      )}
    </section>
  );
}
