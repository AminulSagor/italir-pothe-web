"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getCourseDirectorySummary,
  getCourses,
} from "@/service/course-directory/course.service";
import type {
  CourseDirectorySummary,
  CourseListResponse,
  CourseStatus,
} from "@/types/course-directory/course.type";

import CourseDirectoryFilters from "./course-directory-filters";
import CourseDirectoryHeader from "./course-directory-header";
import CourseDirectoryStats from "./course-directory-stats";
import CourseDirectoryTable from "./course-directory-table";

const COURSE_PAGE_LIMIT = 10;

const initialCourseList: CourseListResponse = {
  items: [],
  page: 1,
  limit: COURSE_PAGE_LIMIT,
  totalItems: 0,
  totalPages: 1,
};

const initialSummary: CourseDirectorySummary = {
  totalCourses: 0,
  activeStudents: 0,
  averageCompletionRate: 0,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const CourseDirectoryContent = () => {
  const [courseList, setCourseList] =
    useState<CourseListResponse>(initialCourseList);

  const [summary, setSummary] =
    useState<CourseDirectorySummary>(initialSummary);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<CourseStatus | "">("");

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSummary = async () => {
      try {
        setIsSummaryLoading(true);

        const response = await getCourseDirectorySummary();

        if (isMounted) {
          setSummary(response);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (isMounted) {
          setSummary(initialSummary);
        }
      } finally {
        if (isMounted) {
          setIsSummaryLoading(false);
        }
      }
    };

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setIsLoading(true);

        const response = await getCourses({
          page,
          limit: COURSE_PAGE_LIMIT,
          search,
          statuses: status,
        });

        if (isMounted) {
          setCourseList(response);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (isMounted) {
          setCourseList(initialCourseList);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      isMounted = false;
    };
  }, [page, search, status]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <section className="space-y-7">
      <CourseDirectoryHeader />

      <CourseDirectoryStats summary={summary} isLoading={isSummaryLoading} />

      <CourseDirectoryFilters
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      <CourseDirectoryTable
        courseList={courseList}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </section>
  );
};

export default CourseDirectoryContent;
