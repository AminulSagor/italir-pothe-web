import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { courseEnrollmentStudents } from "@/mock/course-details/course-enrollment.mock";

const EnrollmentListTable = () => {
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
            {courseEnrollmentStudents.map((student) => (
              <tr
                key={student.id}
                className={`border-t border-black/5 ${
                  student.isMuted ? "opacity-45" : ""
                }`}
              >
                <td className="px-10 py-5">
                  <div className="flex items-center gap-4">
                    <div className="size-11 overflow-hidden rounded-full bg-[#E9FBEF]">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="size-full object-cover"
                      />
                    </div>

                    <div>
                      <p className="max-w-40 font-bold leading-tight text-[#202420]">
                        {student.name}
                      </p>
                      <p className="text-sm text-black/60">
                        ID: {student.studentId}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-[#202420]">
                    {student.phone}
                  </p>
                  <p className="text-sm text-black/50">{student.email}</p>
                </td>

                <td className="px-6 py-5 font-bold text-[#006B3F]">
                  {student.amountPaid}
                </td>

                <td className="px-6 py-5 text-center">
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-[#E9EEE9]"
                    aria-label="View student"
                  >
                    <Eye className="size-5 text-[#3F463F]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-black/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">Showing 4 of 1,248 students</p>

        <div className="flex items-center gap-5">
          <ChevronLeft className="size-4 text-black/70" />

          <button className="size-9 rounded-full bg-[#006B3F] font-semibold text-white">
            1
          </button>

          <button className="text-sm font-semibold text-black/70">2</button>
          <button className="text-sm font-semibold text-black/70">3</button>

          <ChevronRight className="size-4 text-black/70" />
        </div>
      </div>
    </Card>
  );
};

export default EnrollmentListTable;
