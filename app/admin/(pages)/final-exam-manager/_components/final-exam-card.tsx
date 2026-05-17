import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Card from "@/components/UI/cards/card";

import ExamStatusBadge from "./exam-status-badge";
import LinkedCourseChip from "./linked-course-chip";

import { FinalExamItem } from "@/mock/final-exam-manager/final-exam-manager.types";

interface Props {
  exam: FinalExamItem;
}

const FinalExamCard = ({ exam }: Props) => {
  const Icon = exam.icon;

  return (
    <Card
      rounded="3xl"
      padding="lg"
      shadow="sm"
      className="flex min-h-[320px] flex-col"
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div
          className={`flex size-14 items-center justify-center rounded-2xl ${exam.iconBackground}`}
        >
          <Icon className={`size-6 ${exam.iconColor}`} />
        </div>

        <ExamStatusBadge status={exam.status} />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold leading-snug text-[#202420]">
          {exam.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6F7673]">
          <span>{exam.questionCount} Questions</span>

          <div className="size-1 rounded-full bg-[#98A29E]" />

          <span>{exam.duration}</span>
        </div>
      </div>

      <div className="mt-6">
        <LinkedCourseChip courseName={exam.linkedCourse} />
      </div>

      <div className="mt-auto flex items-center gap-5 pt-8">
        <button
          type="button"
          className="text-[#4E5A53] transition hover:text-[#006B3F]"
        >
          <Pencil className="size-4" />
        </button>

        <Link
          href={`/admin/final-exam-manager/${exam.id}`}
          className="text-[#4E5A53] transition hover:text-[#006B3F]"
        >
          <Eye className="size-4" />
        </Link>

        <button
          type="button"
          className="ml-auto text-[#4E5A53] transition hover:text-red-500"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </Card>
  );
};

export default FinalExamCard;