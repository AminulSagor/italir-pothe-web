import { GripVertical, Lock, Settings, Trash2, Video } from "lucide-react";
import Link from "next/link";

import type { SyllabusLesson } from "@/types/course-directory/syllabus.type";

interface SyllabusLessonRowProps {
  courseId: string;
  chapterId: string;
  lesson: SyllabusLesson;
  onDragStart: () => void;
  onDrop: () => void;
  onDelete: () => void;
}

export default function SyllabusLessonRow({
  courseId,
  chapterId,
  lesson,
  onDragStart,
  onDrop,
  onDelete,
}: SyllabusLessonRowProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className="flex flex-col gap-3 rounded-xl border border-[#E2E8E1] bg-[#F7FBF4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 items-center gap-3">
        <GripVertical className="size-4 shrink-0 text-[#A7B2AA]" />

        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#DCF8D8]">
          <Video className="size-4 text-[#009F5A]" />
        </div>

        <p className="truncate text-sm font-medium text-[#202420]">
          {lesson.title}
        </p>
      </div>

      <div className="flex items-center justify-end gap-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
            lesson.isFree
              ? "bg-[#BDF7B8] text-[#009F5A]"
              : "bg-[#DDF3E8] text-[#007A4A]"
          }`}
        >
          {!lesson.isFree ? <Lock className="size-3" /> : null}
          {lesson.isFree ? "free" : "premium"}
        </span>

        <Link
          href={`/admin/course-directory/syllabus-builder/lesson-edit?courseId=${courseId}&chapterId=${chapterId}&lessonId=${lesson.id}`}
          className="text-[#66736B] hover:text-[#202420]"
        >
          <Settings className="size-4" />
        </Link>

        <button
          type="button"
          onClick={onDelete}
          className="text-[#66736B] hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
