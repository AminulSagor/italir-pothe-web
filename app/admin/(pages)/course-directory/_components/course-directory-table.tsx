import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

import Card from "@/components/UI/cards/card";
import type {
  Course,
  CourseListResponse,
  CourseStatus,
} from "@/types/course-directory/course.type";

interface CourseDirectoryTableProps {
  courseList: CourseListResponse;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

const statusClasses: Record<CourseStatus, string> = {
  published: "bg-[#DDFBE6] text-[#00864F]",
  draft: "bg-[#E5E8E5] text-black/55",
  archived: "bg-[#FFE3E0] text-[#D34A3A]",
};

const statusLabels: Record<CourseStatus, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
};

const getPriceNumber = (course: Course) => {
  if (course.price === null || course.price === undefined) return 0;

  const numericPrice = Number(course.price);

  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

const CoursePrice = ({ course }: { course: Course }) => {
  const price = getPriceNumber(course);
  const isFree = course.isFree || price === 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-[#202420]">
        €{price.toFixed(2)}
      </span>

      {isFree ? (
        <span className="rounded-full bg-[#DDFBE6] px-2 py-0.5 text-[10px] font-bold uppercase text-[#00864F]">
          Free
        </span>
      ) : null}
    </div>
  );
};

const CourseDirectoryTable = ({
  courseList,
  isLoading = false,
  onPageChange,
}: CourseDirectoryTableProps) => {
  const startItem =
    courseList.totalItems === 0
      ? 0
      : (courseList.page - 1) * courseList.limit + 1;

  const endItem = Math.min(
    courseList.page * courseList.limit,
    courseList.totalItems,
  );

  const canGoPrevious = courseList.page > 1;
  const canGoNext = courseList.page < courseList.totalPages;

  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-white">
            <tr className="text-left">
              <th className="px-8 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Course Name
              </th>
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Subtitle
              </th>
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Students
              </th>
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Price
              </th>
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Status
              </th>
              <th className="px-6 py-6 text-center text-sm font-bold uppercase text-[#3F463F]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr className="border-t border-black/5">
                <td
                  colSpan={6}
                  className="px-8 py-10 text-center text-sm text-black/60"
                >
                  Loading courses...
                </td>
              </tr>
            ) : courseList.items.length > 0 ? (
              courseList.items.map((course) => (
                <tr key={course.id} className="border-t border-black/5">
                  <td className="px-8 py-7">
                    <p className="max-w-56 font-bold leading-tight text-[#202420]">
                      {course.title}
                    </p>
                  </td>

                  <td className="px-6 py-7 text-sm text-black/65">
                    <p className="max-w-72 leading-6">
                      {course.subtitle || "No subtitle"}
                    </p>
                  </td>

                  <td className="px-6 py-7 text-sm text-black/65">
                    {course.totalStudentEnrollments || 0}
                  </td>

                  <td className="px-6 py-7">
                    <CoursePrice course={course} />
                  </td>

                  <td className="px-6 py-7">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[course.status]}`}
                    >
                      {statusLabels[course.status]}
                    </span>
                  </td>

                  <td className="px-6 py-7">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href={`/admin/course-directory/course-details/${course.id}`}
                      >
                        <button type="button" aria-label="View course">
                          <Eye className="size-4 text-[#006B3F]" />
                        </button>
                      </Link>

                      <Link
                        href={`/admin/course-directory/create-course?courseId=${course.id}`}
                      >
                        <button type="button" aria-label="Edit course">
                          <Edit2 className="size-4 text-black/45" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-black/5">
                <td
                  colSpan={6}
                  className="px-8 py-10 text-center text-sm text-black/60"
                >
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-black/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">
          Showing {startItem} to {endItem} of {courseList.totalItems} courses
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() => onPageChange(courseList.page - 1)}
            aria-label="Previous page"
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="size-4 text-black/50" />
          </button>

          <button className="size-8 rounded-full bg-[#006B3F] font-semibold text-white">
            {courseList.page}
          </button>

          {courseList.page + 1 <= courseList.totalPages ? (
            <button
              type="button"
              onClick={() => onPageChange(courseList.page + 1)}
              className="text-sm text-black/70"
            >
              {courseList.page + 1}
            </button>
          ) : null}

          {courseList.page + 2 <= courseList.totalPages ? (
            <button
              type="button"
              onClick={() => onPageChange(courseList.page + 2)}
              className="text-sm text-black/70"
            >
              {courseList.page + 2}
            </button>
          ) : null}

          {courseList.page + 2 < courseList.totalPages ? (
            <MoreHorizontal className="size-4 text-black/50" />
          ) : null}

          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onPageChange(courseList.page + 1)}
            aria-label="Next page"
            className="disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="size-4 text-black/70" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CourseDirectoryTable;
