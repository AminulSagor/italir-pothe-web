"use client";

import Link from "next/link";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

import Accordion from "@/components/UI/accordion/accordion";
import type {
  SyllabusChapter,
  SyllabusLesson,
} from "@/types/course-directory/syllabus.type";

import SyllabusLessonRow from "./syllabus-lesson-row";

interface SyllabusChapterCardProps {
  courseId: string;
  chapter: SyllabusChapter;
  chapterNumber: number;
  onEditChapter: () => void;
  onDeleteChapter: () => void;
  onDeleteLesson: (lesson: SyllabusLesson) => void;
  onChapterDragStart: () => void;
  onChapterDrop: () => void;
  onLessonDragStart: (lesson: SyllabusLesson) => void;
  onLessonDrop: (lesson: SyllabusLesson) => void;
}

export default function SyllabusChapterCard({
  courseId,
  chapter,
  chapterNumber,
  onEditChapter,
  onDeleteChapter,
  onDeleteLesson,
  onChapterDragStart,
  onChapterDrop,
  onLessonDragStart,
  onLessonDrop,
}: SyllabusChapterCardProps) {
  return (
    <div
      draggable
      onDragStart={onChapterDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onChapterDrop}
    >
      <Accordion
        defaultOpen={chapterNumber === 1}
        className="border-[#E2E8E1]"
        headerClassName="px-4 py-4 sm:px-6"
        contentClassName="bg-white px-4 py-4 sm:px-10"
        title={
          <div className="flex min-w-0 items-center gap-3">
            <GripVertical className="size-4 shrink-0 text-[#98A39C]" />

            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#009F5A] text-sm font-semibold text-white">
              {chapterNumber}
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[#202420] sm:text-base">
                {chapter.title}
              </h3>

              <span className="mt-1 inline-flex rounded-full bg-[#EEF3EC] px-2 py-0.5 text-[10px] font-medium text-[#8A968E]">
                {chapter.lessons?.length || chapter.totalLessons || 0} Lessons
              </span>
            </div>
          </div>
        }
        rightContent={
          <div className="flex items-center gap-3">
            <button type="button" onClick={onEditChapter}>
              <Pencil className="size-4 text-[#66736B]" />
            </button>

            <button
              type="button"
              onClick={onDeleteChapter}
              className="text-[#66736B] hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {chapter.lessons?.length ? (
            chapter.lessons.map((lesson) => (
              <SyllabusLessonRow
                key={lesson.id}
                courseId={courseId}
                chapterId={chapter.id}
                lesson={lesson}
                onDragStart={() => onLessonDragStart(lesson)}
                onDrop={() => onLessonDrop(lesson)}
                onDelete={() => onDeleteLesson(lesson)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-[#E2E8E1] bg-[#F7FBF4] px-4 py-4 text-center text-sm text-[#66736B]">
              No lessons found in this chapter.
            </div>
          )}

          <Link
            href={`/admin/course-directory/syllabus-builder/lesson-edit?courseId=${courseId}&chapterId=${chapter.id}`}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD6CE] text-xs font-semibold text-[#66736B] hover:bg-[#F7FBF4]"
          >
            <Plus className="size-4" />
            Add New Lesson to {chapter.title}
          </Link>
        </div>
      </Accordion>
    </div>
  );
}
