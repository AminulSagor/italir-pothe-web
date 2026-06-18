import Link from "next/link";
import {
  BookOpen,
  BriefcaseBusiness,
  Eye,
  Languages,
  Mic,
  Pencil,
  ScrollText,
  Trash2,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { FinalExamListItem } from "@/types/final-exam/final-exam.type";
import { isValidUuid } from "@/utils/uuid";

import ExamStatusBadge from "./exam-status-badge";
import LinkedCourseChip from "./linked-course-chip";

interface FinalExamCardProps {
  exam: FinalExamListItem;
  index: number;
  isDeleting?: boolean;
  isLinking?: boolean;
  onDelete: (examId: string) => void;
  onLinkCourse: (examId: string) => void;
  onDelinkCourse: (examId: string) => void;
}

const examIconOptions = [
  {
    icon: BookOpen,
    iconBackground: "bg-[#E8F1FF]",
    iconColor: "text-[#006B3F]",
  },
  {
    icon: Languages,
    iconBackground: "bg-[#FCE8F8]",
    iconColor: "text-[#A03CA0]",
  },
  {
    icon: ScrollText,
    iconBackground: "bg-[#FFF1DD]",
    iconColor: "text-[#9C6411]",
  },
  {
    icon: BriefcaseBusiness,
    iconBackground: "bg-[#E8F1FF]",
    iconColor: "text-[#006B3F]",
  },
  {
    icon: Mic,
    iconBackground: "bg-[#E8F1FF]",
    iconColor: "text-[#006B3F]",
  },
];

const getExamIcon = (index: number) => {
  return examIconOptions[index % examIconOptions.length];
};

const getLinkedCourseName = (exam: FinalExamListItem) => {
  return exam.linkedCourseTitle || exam.courseTitle || "Independent";
};

const FinalExamCard = ({
  exam,
  index,
  isDeleting = false,
  isLinking = false,
  onDelete,
  onLinkCourse,
  onDelinkCourse,
}: FinalExamCardProps) => {
  const iconConfig = getExamIcon(index);
  const Icon = iconConfig.icon;
  const canOpenExam = isValidUuid(exam.id);

  const examDetailsHref = canOpenExam
    ? `/admin/final-exam-manager/${exam.id}`
    : "/admin/final-exam-manager";

  const isLinked = Boolean(exam.courseId);

  return (
    <Card
      rounded="3xl"
      padding="lg"
      shadow="sm"
      className="flex min-h-[320px] flex-col"
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div
          className={`flex size-14 items-center justify-center rounded-2xl ${iconConfig.iconBackground}`}
        >
          <Icon className={`size-6 ${iconConfig.iconColor}`} />
        </div>

        <ExamStatusBadge status={exam.status} />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold leading-snug text-[#202420]">
          {exam.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6F7673]">
          <span>{exam.totalQuestions || 0} Questions</span>

          <div className="size-1 rounded-full bg-[#98A29E]" />

          <span>{exam.totalDurationMinutes || 0} Mins</span>
        </div>
      </div>

      <div className="mt-6">
        <LinkedCourseChip
          courseName={getLinkedCourseName(exam)}
          isLinked={isLinked}
          isLoading={isLinking}
          onLinkCourse={() => onLinkCourse(exam.id)}
          onDelinkCourse={() => onDelinkCourse(exam.id)}
        />
      </div>

      <div className="mt-auto flex items-center gap-5 pt-8">
        <Link
          href={examDetailsHref}
          className="text-[#4E5A53] transition hover:text-[#006B3F]"
          aria-label="Edit final exam"
        >
          <Pencil className="size-4" />
        </Link>

        <Link
          href={examDetailsHref}
          className="text-[#4E5A53] transition hover:text-[#006B3F]"
          aria-label="View final exam"
        >
          <Eye className="size-4" />
        </Link>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(exam.id)}
          className="ml-auto text-[#4E5A53] transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Delete final exam"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </Card>
  );
};

export default FinalExamCard;
