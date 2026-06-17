import {
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type { Course } from "@/types/course-directory/course.type";

interface EnrollmentListTableProps {
  course: Course;
}

const EnrollmentListTable = ({ course }: EnrollmentListTableProps) => {
  const totalStudents = course.totalStudentEnrollments || 0;

  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#E9FBEF]">
            <UsersRound className="size-5 text-[#006B3F]" />
          </div>

          <h2 className="text-lg font-bold text-[#202420]">Enrollment List</h2>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="gap-2 bg-[#E9EEE9]">
            <SlidersHorizontal className="size-4" />
            Filter
          </Button>

          <Button variant="ghost" size="sm" className="gap-2 bg-[#E9EEE9]">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px]">
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
              <th className="px-6 py-6 text-center text-xs font-bold uppercase text-[#3F463F]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-black/5">
              <td
                colSpan={4}
                className="px-10 py-12 text-center text-sm text-black/60"
              >
                No enrollment list API is connected yet for this course.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-black/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">
          Showing 0 of {totalStudents.toLocaleString()} students
        </p>

        <div className="flex items-center gap-5">
          <ChevronLeft className="size-4 text-black/70" />

          <button className="size-9 rounded-full bg-[#006B3F] font-semibold text-white">
            1
          </button>

          <ChevronRight className="size-4 text-black/70" />
        </div>
      </div>
    </Card>
  );
};

export default EnrollmentListTable;
