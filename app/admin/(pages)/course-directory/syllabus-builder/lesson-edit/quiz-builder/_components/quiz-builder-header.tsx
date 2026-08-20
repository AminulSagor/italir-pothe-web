import { Archive, ArrowLeft, Save, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface QuizBuilderHeaderProps {
  courseTitle?: string;
  chapterTitle?: string;
  lessonTitle?: string;
  quizTitle?: string;
  isPublishing?: boolean;
  isArchiving?: boolean;
  isDeleting?: boolean;
  onBack: () => void;
  onPublish: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export default function QuizBuilderHeader({
  courseTitle,
  chapterTitle,
  lessonTitle,
  quizTitle,
  isPublishing = false,
  isArchiving = false,
  isDeleting = false,
  onBack,
  onPublish,
  onArchive,
  onDelete,
}: QuizBuilderHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#7A867D]">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#F4F7F4]"
          >
            <ArrowLeft className="size-4 text-[#006B3F]" />
          </button>

          <span>Courses</span>
          <span>/</span>
          <span>{courseTitle || "Course"}</span>
          <span>/</span>
          <span>{chapterTitle || "Chapter"}</span>
          <span>/</span>
          <span>{lessonTitle || "Lesson"}</span>
          <span>/</span>
          <span className="text-[#007A4A]">Quiz Builder</span>
        </div>

        <h1 className="text-2xl font-bold text-[#007A4A] sm:text-3xl">
          Quiz Builder: {lessonTitle || "Lesson"}
        </h1>

        <p className="mt-1 text-sm text-[#66736B]">
          {quizTitle ||
            "Manage questions and interactive content for the Italian language module."}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <Button
          size="md"
          variant="ghost"
          disabled={isPublishing || isArchiving || isDeleting}
          className="gap-2 text-[#8A5A00] !bg-[#FFF2CC] hover:!bg-[#FFE7A3]"
          onClick={onArchive}
        >
          <Archive className="size-4" />
          {isArchiving ? "Archiving..." : "Archive"}
        </Button>

        <Button
          size="md"
          variant="ghost"
          disabled={isPublishing || isArchiving || isDeleting}
          className="gap-2 text-[#C40000] !bg-[#FFE1E1] hover:!bg-[#FFD1D1]"
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>

        <Button
          size="md"
          disabled={isPublishing || isArchiving || isDeleting}
          className="gap-2"
          onClick={onPublish}
        >
          <Save className="size-4" />
          {isPublishing ? "Publishing..." : "Save & Publish Quiz"}
        </Button>
      </div>
    </div>
  );
}
