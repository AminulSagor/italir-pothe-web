import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  UsersRound,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import type {
  CommerceSortOrder,
  CourseEnrollment,
  CourseEnrollmentListResponse,
  CourseEnrollmentSortBy,
} from "@/types/course-directory/course-commerce.type";

import EnrollmentExportMenu from "./enrollment-export-menu";
import EnrollmentFilterMenu from "./enrollment-filter-menu";

interface EnrollmentListTableProps {
  enrollmentList: CourseEnrollmentListResponse;
  isLoading: boolean;
  status: string;
  paymentProvider: string;
  sortBy: CourseEnrollmentSortBy;
  sortOrder: CommerceSortOrder;
  statusOptions: string[];
  isExportingAll: boolean;
  onFilterChange: (values: {
    status: string;
    paymentProvider: string;
    sortBy: CourseEnrollmentSortBy;
    sortOrder: CommerceSortOrder;
  }) => void;
  onPageChange: (page: number) => void;
  onViewEnrollment: (enrollmentId: string) => void;
  onExportCurrentPage: () => void;
  onExportAll: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatCurrency = (enrollment: CourseEnrollment) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: enrollment.currency || "EUR",
      minimumFractionDigits: 2,
    }).format(enrollment.amountPaid);
  } catch {
    return `${enrollment.currency} ${enrollment.amountPaid.toFixed(2)}`;
  }
};

const formatLabel = (value?: string | null) => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getBilling = (enrollment: CourseEnrollment) => {
  return enrollment.billing || enrollment.order?.billing || null;
};

const getProvider = (enrollment: CourseEnrollment) => {
  const billing = getBilling(enrollment);

  return (
    billing?.provider ||
    enrollment.storeProduct?.provider ||
    enrollment.payment?.provider ||
    enrollment.paymentProvider ||
    "—"
  );
};

const getVerificationStatus = (enrollment: CourseEnrollment) => {
  const billing = getBilling(enrollment);

  return (
    billing?.verificationStatus ||
    enrollment.verification?.verificationStatus ||
    enrollment.verification?.status ||
    null
  );
};

const getTransactionId = (enrollment: CourseEnrollment) => {
  const billing = getBilling(enrollment);

  return (
    billing?.providerTransactionId ||
    enrollment.verification?.providerTransactionId ||
    "—"
  );
};

const getStatusClassName = (statusValue: string) => {
  const normalizedStatus = statusValue.toLowerCase();

  if (
    normalizedStatus === "active" ||
    normalizedStatus === "paid" ||
    normalizedStatus === "completed"
  ) {
    return "bg-[#DDF3E8] text-[#006B3F]";
  }

  if (
    normalizedStatus === "refunded" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {
    return "bg-[#FCEBEC] text-[#B42318]";
  }

  return "bg-[#EEF3EC] text-[#4F5B52]";
};

const EnrollmentListTable = ({
  enrollmentList,
  isLoading,
  status,
  paymentProvider,
  sortBy,
  sortOrder,
  statusOptions,
  isExportingAll,
  onFilterChange,
  onPageChange,
  onViewEnrollment,
  onExportCurrentPage,
  onExportAll,
}: EnrollmentListTableProps) => {
  const startItem =
    enrollmentList.totalItems === 0
      ? 0
      : (enrollmentList.page - 1) * enrollmentList.limit + 1;

  const endItem = Math.min(
    enrollmentList.page * enrollmentList.limit,
    enrollmentList.totalItems,
  );

  const canGoPrevious = enrollmentList.page > 1;

  const canGoNext = enrollmentList.page < enrollmentList.totalPages;

  const visiblePageStart = Math.min(
    Math.max(1, enrollmentList.page - 1),
    Math.max(1, enrollmentList.totalPages - 2),
  );

  const visiblePages = Array.from(
    {
      length: Math.min(3, enrollmentList.totalPages),
    },
    (_, index) => visiblePageStart + index,
  );

  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-visible">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#E9FBEF]">
            <UsersRound className="size-5 text-[#006B3F]" />
          </div>

          <h2 className="text-lg font-bold text-[#202420]">Enrollment List</h2>
        </div>

        <div className="flex gap-3">
          <EnrollmentFilterMenu
            status={status}
            paymentProvider={paymentProvider}
            sortBy={sortBy}
            sortOrder={sortOrder}
            statusOptions={statusOptions}
            onApply={onFilterChange}
          />

          <EnrollmentExportMenu
            disabled={enrollmentList.items.length === 0}
            isExportingAll={isExportingAll}
            onExportCurrentPage={onExportCurrentPage}
            onExportAll={onExportAll}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1320px]">
          <thead className="bg-[#F7FAF6]">
            <tr className="text-left">
              <th className="px-10 py-6 text-xs font-bold uppercase text-[#3F463F]">
                Student
              </th>

              <th className="px-6 py-6 text-xs font-bold uppercase text-[#3F463F]">
                Contact
              </th>

              <th className="px-6 py-6 text-xs font-bold uppercase text-[#3F463F]">
                Amount <br /> Paid
              </th>

              <th className="px-6 py-6 text-xs font-bold uppercase text-[#3F463F]">
                Date
              </th>

              <th className="px-6 py-6 text-xs font-bold uppercase text-[#3F463F]">
                Status
              </th>

              <th className="px-6 py-6 text-xs font-bold uppercase text-[#3F463F]">
                Billing
              </th>

              <th className="px-6 py-6 text-center text-xs font-bold uppercase text-[#3F463F]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr className="border-t border-black/5">
                <td
                  colSpan={7}
                  className="px-10 py-12 text-center text-sm text-black/60"
                >
                  Loading enrollments...
                </td>
              </tr>
            ) : enrollmentList.items.length > 0 ? (
              enrollmentList.items.map((enrollment) => {
                const normalizedStatus = enrollment.status || "unknown";

                const isInactive =
                  normalizedStatus === "refunded" ||
                  normalizedStatus === "cancelled" ||
                  normalizedStatus === "canceled";

                return (
                  <tr
                    key={enrollment.id}
                    className={`border-t border-black/5 ${
                      isInactive ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        {enrollment.student.avatarUrl ? (
                          <img
                            src={enrollment.student.avatarUrl}
                            alt={enrollment.student.name}
                            className="size-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-[#E9FBEF] text-xs font-bold text-[#006B3F]">
                            {getInitials(enrollment.student.name)}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold leading-tight text-[#202420]">
                            {enrollment.student.name}
                          </p>

                          <p className="mt-1 text-xs text-black/55">
                            ID:{" "}
                            {enrollment.student.studentCode ||
                              enrollment.student.id ||
                              "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-6">
                      <p className="text-sm text-[#202420]">
                        {enrollment.student.phone || "—"}
                      </p>

                      <p className="mt-1 text-xs text-black/55">
                        {enrollment.student.email || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-6 font-semibold text-[#006B3F]">
                      {formatCurrency(enrollment)}
                    </td>

                    <td className="px-6 py-6 text-sm font-medium text-[#202420]">
                      {formatDate(enrollment.enrolledAt)}
                    </td>

                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClassName(
                          normalizedStatus,
                        )}`}
                      >
                        {formatLabel(normalizedStatus)}
                      </span>
                    </td>

                    <td className="px-6 py-6 align-top">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-[#202420]">
                          {formatLabel(getProvider(enrollment))}
                        </p>

                        <p className="max-w-[220px] break-all text-xs text-[#8A948C]">
                          Txn: {getTransactionId(enrollment)}
                        </p>

                        <p className="text-xs text-[#8A948C]">
                          Verification:{" "}
                          {formatLabel(getVerificationStatus(enrollment))}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-6 text-center">
                      <button
                        type="button"
                        onClick={() => onViewEnrollment(enrollment.id)}
                        className="inline-flex size-10 items-center justify-center rounded-full bg-[#E9EEE9] text-[#4E5A53] transition hover:bg-[#DDFBE6] hover:text-[#006B3F]"
                        aria-label={`View ${enrollment.student.name}`}
                      >
                        <Eye className="size-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t border-black/5">
                <td
                  colSpan={7}
                  className="px-10 py-12 text-center text-sm text-black/60"
                >
                  No enrollments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-black/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">
          Showing {startItem} to {endItem} of{" "}
          {enrollmentList.totalItems.toLocaleString()} students
        </p>

        <div className="flex items-center gap-5">
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() => onPageChange(enrollmentList.page - 1)}
            aria-label="Previous page"
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4 text-black/70" />
          </button>

          {visiblePages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`size-9 rounded-full font-semibold ${
                pageNumber === enrollmentList.page
                  ? "bg-[#006B3F] text-white"
                  : "text-black/70"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          {visiblePages.at(-1) !== enrollmentList.totalPages &&
            enrollmentList.totalPages > 3 && (
              <MoreHorizontal className="size-4 text-black/50" />
            )}

          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onPageChange(enrollmentList.page + 1)}
            aria-label="Next page"
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="size-4 text-black/70" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default EnrollmentListTable;
