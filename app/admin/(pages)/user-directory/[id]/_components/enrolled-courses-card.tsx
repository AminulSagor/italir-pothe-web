"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAdminUserCourses } from "@/service/user-directory/user-directory.service";
import type {
  AdminUserCourseSortBy,
  AdminUserCoursesResponse,
  AdminUserSortOrder,
} from "@/types/user-directory/user-directory.type";

interface EnrolledCoursesCardProps {
  userId: string;

  initialResponse: AdminUserCoursesResponse;
}

const PAGE_LIMIT = 3;

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load enrolled courses.";
};

export default function EnrolledCoursesCard({
  userId,
  initialResponse,
}: EnrolledCoursesCardProps) {
  const [response, setResponse] =
    useState<AdminUserCoursesResponse>(initialResponse);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");

  const [sortBy, setSortBy] = useState<AdminUserCourseSortBy>("enrolledAt");

  const [sortOrder, setSortOrder] = useState<AdminUserSortOrder>("DESC");

  const [isLoading, setIsLoading] = useState(false);

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;

      return;
    }

    let mounted = true;

    const loadCourses = async () => {
      try {
        const result = await getAdminUserCourses(userId, {
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

    void loadCourses();

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
        <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <GraduationCap className="size-5" />
        </span>

        <h2 className="text-lg font-semibold text-black/90">
          Enrolled Courses
        </h2>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="flex h-11 flex-1 items-center gap-3 rounded-full bg-[#EEF3EC] px-4">
          <Search className="size-4 text-black/35" />

          <input
            value={search}
            placeholder="Search courses..."
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

            setSortBy(event.target.value as AdminUserCourseSortBy);
          }}
          className="h-11 rounded-full bg-[#EEF3EC] px-4 text-sm outline-none"
        >
          <option value="enrolledAt">Enrollment Date</option>

          <option value="progress">Progress</option>

          <option value="title">Title</option>

          <option value="lastActivityAt">Last Activity</option>
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

      <div className={`space-y-8 ${isLoading ? "opacity-55" : ""}`}>
        {response.items.map((course) => (
          <div key={course.enrollmentId}>
            <div className="flex items-center gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                <BookOpen className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-semibold text-black/90">
                    {course.title}
                  </h3>

                  {course.isFree && (
                    <span className="rounded-full bg-[#DDF3E8] px-3 py-1 text-[10px] font-bold uppercase text-secondary">
                      Free
                    </span>
                  )}
                </div>

                <p className="mt-1 truncate text-sm text-black/45">
                  {course.subtitle || course.enrollmentStatus}
                </p>

                <p className="mt-1 text-xs font-medium uppercase text-black/35">
                  {course.completionPercent}% Progress •{" "}
                  {course.completedLessons}/{course.totalLessons} lessons
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E6ECE4]">
              <div
                className="h-full rounded-full bg-secondary"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, course.completionPercent),
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}

        {!response.items.length && (
          <p className="py-8 text-center text-sm text-black/40">
            No enrolled courses found.
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
              aria-label="Previous courses page"
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
              aria-label="Next courses page"
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
