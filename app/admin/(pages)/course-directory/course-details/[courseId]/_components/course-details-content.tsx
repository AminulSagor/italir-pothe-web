"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  demoRefundCoursePurchase,
  getAllCourseEnrollments,
  getCourseEnrollmentById,
  getCourseEnrollmentFilterOptions,
  getCourseEnrollments,
  getCourseEnrollmentSummary,
} from "@/service/course-directory/course-commerce.service";
import { getCourseById } from "@/service/course-directory/course.service";
import type {
  CommerceSortOrder,
  CourseEnrollmentDetails,
  CourseEnrollmentFilterOptions,
  CourseEnrollmentListResponse,
  CourseEnrollmentSortBy,
  CourseEnrollmentSummary,
} from "@/types/course-directory/course-commerce.type";
import type { Course } from "@/types/course-directory/course.type";
import {
  createSafeExportFilename,
  downloadCourseEnrollmentsCsv,
} from "@/utils/course-enrollment-export.util";

import CourseDetailsHeader from "./course-details-header";
import CourseDetailsStats from "./course-details-stats";
import EnrollmentDetailsDialog from "./enrollment-details-dialog";
import EnrollmentListTable from "./enrollment-list-table";

const ENROLLMENT_PAGE_LIMIT = 10;

const initialEnrollmentList: CourseEnrollmentListResponse = {
  items: [],
  page: 1,
  limit: ENROLLMENT_PAGE_LIMIT,
  totalItems: 0,
  totalPages: 1,
};

const initialFilterOptions: CourseEnrollmentFilterOptions = {
  statuses: [],
  paymentProviders: [],
};

interface CourseDetailsContentProps {
  courseId: string;
  page: number;
  search: string;
  status: string;
  paymentProvider: string;
  sortBy: CourseEnrollmentSortBy;
  sortOrder: CommerceSortOrder;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;

  return "Something went wrong. Please try again.";
};

const CourseDetailsContent = ({
  courseId,
  page,
  search,
  status,
  paymentProvider,
  sortBy,
  sortOrder,
}: CourseDetailsContentProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [course, setCourse] = useState<Course | null>(null);

  const [summary, setSummary] = useState<CourseEnrollmentSummary | null>(null);

  const [enrollmentList, setEnrollmentList] =
    useState<CourseEnrollmentListResponse>(initialEnrollmentList);

  const [filterOptions, setFilterOptions] =
    useState<CourseEnrollmentFilterOptions>(initialFilterOptions);

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<CourseEnrollmentDetails | null>(null);

  const [isCourseLoading, setIsCourseLoading] = useState(true);

  const [isEnrollmentLoading, setIsEnrollmentLoading] = useState(true);

  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const [isExportingAll, setIsExportingAll] = useState(false);

  const [isRefunding, setIsRefunding] = useState(false);

  const enrollmentQuery = useMemo(
    () => ({
      page,
      limit: ENROLLMENT_PAGE_LIMIT,
      search,
      status: status || undefined,
      paymentProvider: paymentProvider || undefined,
      sortBy,
      sortOrder,
    }),
    [page, paymentProvider, search, sortBy, sortOrder, status],
  );

  const loadSummary = useCallback(async () => {
    try {
      const response = await getCourseEnrollmentSummary(courseId);

      setSummary(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setSummary(null);
    }
  }, [courseId]);

  const loadEnrollments = useCallback(async () => {
    try {
      setIsEnrollmentLoading(true);

      const response = await getCourseEnrollments(courseId, enrollmentQuery);

      setEnrollmentList(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setEnrollmentList({
        ...initialEnrollmentList,
        page,
      });
    } finally {
      setIsEnrollmentLoading(false);
    }
  }, [courseId, enrollmentQuery, page]);

  const loadFilterOptions = useCallback(async () => {
    try {
      const response = await getCourseEnrollmentFilterOptions(courseId);

      setFilterOptions(response);
    } catch {
      setFilterOptions(initialFilterOptions);
    }
  }, [courseId]);

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        setIsCourseLoading(true);

        const response = await getCourseById(courseId);

        if (isMounted) {
          setCourse(response);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (isMounted) {
          setCourse(null);
        }
      } finally {
        if (isMounted) {
          setIsCourseLoading(false);
        }
      }
    };

    void loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    void loadSummary();
    void loadFilterOptions();
  }, [loadFilterOptions, loadSummary]);

  useEffect(() => {
    void loadEnrollments();
  }, [loadEnrollments]);

  const updateQueryParameters = (
    values: Record<string, string | number | undefined>,
  ) => {
    const parameters = new URLSearchParams(window.location.search);

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) {
        parameters.delete(key);
      } else {
        parameters.set(key, String(value));
      }
    });

    const queryString = parameters.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleFilterChange = (values: {
    status: string;
    paymentProvider: string;
    sortBy: CourseEnrollmentSortBy;
    sortOrder: CommerceSortOrder;
  }) => {
    updateQueryParameters({
      page: 1,
      status: values.status,
      paymentProvider: values.paymentProvider,
      sortBy: values.sortBy,
      sortOrder: values.sortOrder,
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > enrollmentList.totalPages) {
      return;
    }

    updateQueryParameters({
      page: nextPage,
    });
  };

  const handleViewEnrollment = async (enrollmentId: string) => {
    try {
      setIsDetailsLoading(true);
      setSelectedEnrollment(null);

      const response = await getCourseEnrollmentById(enrollmentId);

      setSelectedEnrollment(response);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleCloseDetails = () => {
    if (isRefunding) return;

    setSelectedEnrollment(null);
  };

  const handleDemoRefund = async () => {
    if (!selectedEnrollment?.orderId) {
      toast.error("No purchase order is connected to this enrollment.");
      return;
    }

    const toastId = toast.loading("Processing demo refund...");

    try {
      setIsRefunding(true);

      await demoRefundCoursePurchase(selectedEnrollment.orderId);

      toast.success("Demo refund completed successfully.", {
        id: toastId,
      });

      const refreshedDetails = await getCourseEnrollmentById(
        selectedEnrollment.id,
      );

      setSelectedEnrollment(refreshedDetails);

      await Promise.all([
        loadSummary(),
        loadEnrollments(),
        loadFilterOptions(),
      ]);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsRefunding(false);
    }
  };

  const handleExportCurrentPage = () => {
    if (!course || enrollmentList.items.length === 0) {
      toast.error("There are no enrollments on this page to export.");
      return;
    }

    const filename = createSafeExportFilename(course.title) || "course";

    downloadCourseEnrollmentsCsv(
      enrollmentList.items,
      `${filename}-enrollments-page-${enrollmentList.page}.csv`,
    );

    toast.success("Current page exported.");
  };

  const handleExportAll = async () => {
    if (!course) return;

    const toastId = toast.loading("Preparing all enrollment records...");

    try {
      setIsExportingAll(true);

      const enrollments = await getAllCourseEnrollments(courseId, {
        search,
        status: status || undefined,
        paymentProvider: paymentProvider || undefined,
        sortBy,
        sortOrder,
      });

      if (enrollments.length === 0) {
        toast.error("There are no matching enrollments to export.", {
          id: toastId,
        });
        return;
      }

      const filename = createSafeExportFilename(course.title) || "course";

      downloadCourseEnrollmentsCsv(
        enrollments,
        `${filename}-all-enrollments.csv`,
      );

      toast.success(`${enrollments.length} enrollments exported.`, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsExportingAll(false);
    }
  };

  if (isCourseLoading) {
    return (
      <section className="space-y-7">
        <div className="rounded-3xl bg-white px-6 py-10 text-sm text-black/60">
          Loading course details...
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="space-y-7">
        <div className="rounded-3xl bg-white px-6 py-10 text-sm text-black/60">
          Course not found.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-7">
      <CourseDetailsHeader course={course} />

      <CourseDetailsStats course={course} summary={summary} />

      <EnrollmentListTable
        enrollmentList={enrollmentList}
        isLoading={isEnrollmentLoading}
        status={status}
        paymentProvider={paymentProvider}
        sortBy={sortBy}
        sortOrder={sortOrder}
        statusOptions={filterOptions.statuses}
        paymentProviderOptions={filterOptions.paymentProviders}
        isExportingAll={isExportingAll}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onViewEnrollment={handleViewEnrollment}
        onExportCurrentPage={handleExportCurrentPage}
        onExportAll={handleExportAll}
      />

      <EnrollmentDetailsDialog
        open={isDetailsLoading || Boolean(selectedEnrollment)}
        enrollment={selectedEnrollment}
        isLoading={isDetailsLoading}
        isRefunding={isRefunding}
        onClose={handleCloseDetails}
        onDemoRefund={handleDemoRefund}
      />
    </section>
  );
};

export default CourseDetailsContent;
