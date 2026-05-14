import Card from "@/components/UI/cards/card";
import EvaluationTableRow from "./evaluation-table-row";
import { evaluationStudentsMock } from "@/mock/evaluation-center/evaluation-center.mock";

export default function EvaluationTable() {
  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#F2F7F1]">
            <tr>
              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                STUDENT
              </th>
              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                LEVEL
              </th>
              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                SUBMISSION DATE
              </th>
              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                TIME IN QUEUE
              </th>
              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                STATUS
              </th>
              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {evaluationStudentsMock.map((student) => (
              <EvaluationTableRow key={student.id} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-end">
        <p className="text-sm text-[#202420]">Showing 1–5 of 14</p>

        <div className="flex items-center gap-3">
          <button className="flex size-10 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm">
            ‹
          </button>

          <button className="flex size-12 items-center justify-center rounded-full bg-[#006B3F] text-white shadow-sm">
            1
          </button>

          <button className="flex size-12 items-center justify-center rounded-full bg-white text-[#202420] shadow-sm">
            2
          </button>

          <button className="flex size-10 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm">
            ›
          </button>
        </div>
      </div>
    </Card>
  );
}
