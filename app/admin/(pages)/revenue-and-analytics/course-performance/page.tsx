import type {
  CoursePerformanceSortBy,
  RevenueCourseStatus,
  RevenueDatePreset,
  RevenueSortOrder,
} from "@/types/revenue-and-analytics/revenue-and-analytics.type";

import CoursePerformanceClient from "./_components/course-performance-client";

interface CoursePerformancePageProps {
  searchParams: Promise<{
    preset?: string | string[];
    from?: string | string[];
    to?: string | string[];
    page?: string | string[];
    limit?: string | string[];
    search?: string | string[];
    status?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPositiveInteger = (value?: string | string[], fallback = 1) => {
  const parsed = Number(getSingleValue(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const datePresets: RevenueDatePreset[] = [
  "last_7_days",
  "last_30_days",
  "last_90_days",
  "this_month",
  "this_year",
  "all_time",
  "custom",
];

const courseStatuses: RevenueCourseStatus[] = [
  "draft",
  "published",
  "archived",
];

const courseSortOptions: CoursePerformanceSortBy[] = [
  "courseName",
  "enrollments",
  "sales",
  "revenue",
  "lastSaleAt",
];

export default async function CoursePerformancePage({
  searchParams,
}: CoursePerformancePageProps) {
  const params = await searchParams;

  const presetValue = getSingleValue(params.preset) as RevenueDatePreset;

  const statusValue = getSingleValue(params.status) as RevenueCourseStatus;

  const sortByValue = getSingleValue(params.sortBy) as CoursePerformanceSortBy;

  const sortOrderValue = getSingleValue(params.sortOrder) as RevenueSortOrder;

  return (
    <CoursePerformanceClient
      preset={datePresets.includes(presetValue) ? presetValue : "last_30_days"}
      from={getSingleValue(params.from)}
      to={getSingleValue(params.to)}
      page={getPositiveInteger(params.page)}
      limit={getPositiveInteger(params.limit, 10)}
      search={getSingleValue(params.search)}
      status={courseStatuses.includes(statusValue) ? statusValue : undefined}
      sortBy={courseSortOptions.includes(sortByValue) ? sortByValue : "revenue"}
      sortOrder={sortOrderValue === "ASC" ? "ASC" : "DESC"}
    />
  );
}
