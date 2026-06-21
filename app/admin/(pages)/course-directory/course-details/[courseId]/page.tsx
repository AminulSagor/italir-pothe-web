import { notFound } from "next/navigation";

import type {
  CommerceSortOrder,
  CourseEnrollmentSortBy,
} from "@/types/course-directory/course-commerce.type";
import { isValidUuid } from "@/utils/uuid";

import CourseDetailsContent from "./_components/course-details-content";

interface CourseDetailsPageProps {
  params: Promise<{
    courseId?: string;
  }>;

  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    status?: string | string[];
    paymentProvider?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPageNumber = (value?: string | string[]) => {
  const parsedValue = Number(getSingleValue(value));

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : 1;
};

const CourseDetailsPage = async ({
  params,
  searchParams,
}: CourseDetailsPageProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const courseId = resolvedParams.courseId;

  if (!isValidUuid(courseId)) {
    notFound();
  }

  const rawSortBy = getSingleValue(resolvedSearchParams.sortBy);

  const rawSortOrder = getSingleValue(resolvedSearchParams.sortOrder);

  const sortBy: CourseEnrollmentSortBy =
    rawSortBy === "amountPaid" ? "amountPaid" : "enrolledAt";

  const sortOrder: CommerceSortOrder = rawSortOrder === "ASC" ? "ASC" : "DESC";

  return (
    <CourseDetailsContent
      courseId={courseId}
      page={getPageNumber(resolvedSearchParams.page)}
      search={getSingleValue(resolvedSearchParams.search)}
      status={getSingleValue(resolvedSearchParams.status)}
      paymentProvider={getSingleValue(resolvedSearchParams.paymentProvider)}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  );
};

export default CourseDetailsPage;
