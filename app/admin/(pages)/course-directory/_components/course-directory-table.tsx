import { ChevronLeft, ChevronRight, Edit2, MoreHorizontal } from "lucide-react";
import Card from "@/components/UI/cards/card";
import { CourseStatus } from "@/mock/course-directory/course-directory-table.type";
import { courseDirectoryTableItems } from "@/mock/course-directory/course-directory-table.mock";
import Link from "next/link";

const statusClasses: Record<CourseStatus, string> = {
  Published: "bg-[#DDFBE6] text-[#00864F]",
  Draft: "bg-[#E5E8E5] text-black/55",
  Archived: "bg-[#FFE3E0] text-[#D34A3A]",
};

const CourseDirectoryTable = () => {
  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead className="bg-white">
            <tr className="text-left">
              <th className="px-8 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Course Name
              </th>
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Category
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
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {courseDirectoryTableItems.map((course) => (
              <tr key={course.id} className="border-t border-black/5">
                <td className="px-8 py-7">
                  <p className="max-w-40 font-bold leading-tight text-[#202420]">
                    {course.courseName}
                  </p>
                </td>

                <td className="px-6 py-7 text-sm text-black/65">
                  {course.category}
                </td>

                <td className="px-6 py-7 text-sm text-black/65">
                  {course.students}
                </td>

                <td className="px-6 py-7 text-sm font-bold text-[#202420]">
                  {course.price}
                </td>

                <td className="px-6 py-7">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[course.status]}`}
                  >
                    {course.status}
                  </span>
                </td>

                <td className="px-6 py-7">
                  <Link href="/admin/course-directory/course-details/1234">
                    <button type="button" aria-label="Edit course">
                      <Edit2 className="size-4 text-black/45" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-black/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">Showing 1 to 4 of 42 courses</p>

        <div className="flex items-center gap-4">
          <button type="button" aria-label="Previous page">
            <ChevronLeft className="size-4 text-black/50" />
          </button>

          <button className="size-8 rounded-full bg-[#006B3F] font-semibold text-white">
            1
          </button>

          <button className="text-sm text-black/70">2</button>
          <button className="text-sm text-black/70">3</button>

          <MoreHorizontal className="size-4 text-black/50" />

          <button type="button" aria-label="Next page">
            <ChevronRight className="size-4 text-black/70" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CourseDirectoryTable;
