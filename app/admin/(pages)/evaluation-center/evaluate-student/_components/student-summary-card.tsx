import { UserRound } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { EvaluationStudentSummary } from "@/mock/evaluation-center/evaluate-student/evaluate-student.types";

interface StudentSummaryCardProps {
  student: EvaluationStudentSummary;
}

export default function StudentSummaryCard({
  student,
}: StudentSummaryCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="grid gap-6 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <div className="flex items-center gap-5">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#E7F5EF]">
            <UserRound className="size-6 text-[#006B3F]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#202420]">
              {student.name}
            </h2>
            <span className="rounded-full bg-[#DDF3E8] px-3 py-1 text-xs font-semibold text-[#006B3F]">
              {student.level}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA5A0]">
            Total Exam Time
          </p>
          <p className="text-xl font-bold text-[#202420]">
            {student.totalExamTime}
            <span className="text-sm font-medium text-[#9CA5A0]">
              {" "}
              /{student.totalExamLimit}
            </span>
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA5A0]">
            App Activity
          </p>
          <p className="text-xl font-bold text-[#202420]">
            {student.appActivity}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#9CA5A0]">
            Status
          </p>
          <p className="flex items-center gap-2 text-sm font-bold text-[#006B3F]">
            <span className="size-2 rounded-full bg-[#0EA83A]" />
            {student.status}
          </p>
        </div>
      </div>
    </Card>
  );
}
