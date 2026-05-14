import Button from "@/components/UI/buttons/button";
import { EvaluationStudent } from "@/mock/evaluation-center/evaluation-center.types";
import Link from "next/link";

interface Props {
  student: EvaluationStudent;
}

const statusDotClasses = {
  "Retake Requested": "bg-[#FF7A00]",
  Evaluated: "bg-[#008A2E]",
  "Awaiting Review": "bg-[#C8D0C9]",
};

export default function EvaluationTableRow({ student }: Props) {
  return (
    <tr className="border-b border-[#EEF2EE] last:border-b-0">
      <td className="px-4 py-6">
        <div className="flex items-center gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#006B3F] ${student.avatarBg}`}
          >
            {student.avatar}
          </div>

          <div>
            <p className="text-sm font-medium text-[#202420]">{student.name}</p>
            <p className="text-xs text-[#5F675F]">{student.email}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-6">
        <span className="rounded-full bg-[#DDE5DD] px-3 py-1 text-xs font-medium text-[#4F5B52]">
          {student.level}
        </span>
      </td>

      <td className="px-4 py-6 text-sm text-[#4F5B52]">
        {student.submissionDate}
      </td>

      <td
        className={`px-4 py-6 text-sm font-medium ${
          student.timeInQueue.includes("42")
            ? "text-[#D92D20]"
            : "text-[#202420]"
        }`}
      >
        {student.timeInQueue}
      </td>

      <td className="px-4 py-6">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${statusDotClasses[student.status]}`}
          />
          <span className="text-xs font-medium text-[#202420]">
            {student.status}
          </span>
        </div>
      </td>

      <td className="px-4 py-6">
        <Link href="/admin/evaluation-center/evaluate-student">
          <Button
            size="sm"
            disabled={student.actionDisabled}
            className={
              student.actionDisabled
                ? "bg-[#EEF0ED] text-[#9BA49D] hover:bg-[#EEF0ED]"
                : ""
            }
          >
            {student.actionLabel}
          </Button>
        </Link>
      </td>
    </tr>
  );
}
