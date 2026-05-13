"use client";

import Link from "next/link";
import { useState } from "react";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

import Accordion from "@/components/UI/accordion/accordion";
import { SyllabusChapterMock } from "@/mock/syllabus-builder/syllabus-builder.types";

import RemoveLessonDialog from "./remove-lesson-dialog";
import SyllabusLessonRow from "./syllabus-lesson-row";

interface SyllabusChapterCardProps {
  chapter: SyllabusChapterMock;
}

export default function SyllabusChapterCard({
  chapter,
}: SyllabusChapterCardProps) {
  const [selectedLessonTitle, setSelectedLessonTitle] = useState("");
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  return (
    <>
      <Accordion
        defaultOpen={chapter.defaultOpen}
        className="border-[#E2E8E1]"
        headerClassName="px-4 py-4 sm:px-6"
        contentClassName="bg-white px-4 py-4 sm:px-10"
        title={
          <div className="flex min-w-0 items-center gap-3">
            <GripVertical className="size-4 shrink-0 text-[#98A39C]" />

            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#009F5A] text-sm font-semibold text-white">
              {chapter.id}
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[#202420] sm:text-base">
                {chapter.title}
              </h3>

              {!chapter.defaultOpen && (
                <span className="mt-1 inline-flex rounded-full bg-[#EEF3EC] px-2 py-0.5 text-[10px] font-medium text-[#8A968E]">
                  {chapter.lessons.length} Lessons
                </span>
              )}
            </div>
          </div>
        }
        rightContent={
          <div className="flex items-center gap-3">
            <Link href="/admin/course-directory/syllabus-builder/lesson-edit">
              <Pencil className="size-4 text-[#66736B]" />
            </Link>

            <button type="button" className="text-[#66736B] hover:text-red-600">
              <Trash2 className="size-4" />
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {chapter.lessons.map((lesson) => (
            <SyllabusLessonRow
              key={lesson.id}
              lesson={lesson}
              onDeleteClick={() => {
                setSelectedLessonTitle(lesson.title);
                setIsRemoveDialogOpen(true);
              }}
            />
          ))}

          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#CBD6CE] text-xs font-semibold text-[#66736B] hover:bg-[#F7FBF4]"
          >
            <Plus className="size-4" />
            Add New Lesson to {chapter.title}
          </button>
        </div>
      </Accordion>

      <RemoveLessonDialog
        open={isRemoveDialogOpen}
        lessonTitle={selectedLessonTitle}
        onClose={() => setIsRemoveDialogOpen(false)}
        onConfirm={() => {
          setIsRemoveDialogOpen(false);
        }}
      />
    </>
  );
}
