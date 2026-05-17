import {
  FileText,
  GripVertical,
  Lock,
  Settings,
  Trash2,
  Video,
} from "lucide-react";

import { SyllabusLessonMock } from "@/mock/syllabus-builder/syllabus-builder.types";

interface SyllabusLessonRowProps {
  lesson: SyllabusLessonMock;
  onDeleteClick: () => void;
}

const lessonIcon = {
  video: Video,
  document: FileText,
  quiz: Video,
};

export default function SyllabusLessonRow({
  lesson,
  onDeleteClick,
}: SyllabusLessonRowProps) {
  const Icon = lessonIcon[lesson.type];
  const isFree = lesson.accessType === "free";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E2E8E1] bg-[#F7FBF4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <GripVertical className="size-4 shrink-0 text-[#A7B2AA]" />

        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#DCF8D8]">
          <Icon className="size-4 text-[#009F5A]" />
        </div>

        <p className="truncate text-sm font-medium text-[#202420]">
          {lesson.title}
        </p>
      </div>

      <div className="flex items-center justify-end gap-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
            isFree
              ? "bg-[#BDF7B8] text-[#009F5A]"
              : "bg-[#DDF3E8] text-[#007A4A]"
          }`}
        >
          {!isFree && <Lock className="size-3" />}
          {lesson.accessType}
        </span>

        <button type="button" className="text-[#66736B] hover:text-[#202420]">
          <Settings className="size-4" />
        </button>

        <button
          type="button"
          onClick={onDeleteClick}
          className="text-[#66736B] hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
