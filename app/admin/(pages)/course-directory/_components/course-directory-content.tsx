"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getCourses } from "@/service/course-directory/course.service";
import type {
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

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const CourseDirectoryContent = () => {
  const [courseList, setCourseList] =
    useState<CourseListResponse>(initialCourseList);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CourseStatus | "">("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

    loadCourses();

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

      <CourseDirectoryStats
        courses={courseList.items}
        totalCourses={courseList.totalItems}
      />

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
