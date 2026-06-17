import { ArrowLeft, Save } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface QuizBuilderHeaderProps {
  courseTitle?: string;
  chapterTitle?: string;
  lessonTitle?: string;
  quizTitle?: string;
  isPublishing?: boolean;
  onBack: () => void;
  onPublish: () => void;
}

export default function QuizBuilderHeader({
  courseTitle,
  chapterTitle,
  lessonTitle,
  quizTitle,
  isPublishing = false,
  onBack,
  onPublish,
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

      <Button
        size="md"
        disabled={isPublishing}
        className="w-full gap-2 sm:w-fit"
        onClick={onPublish}
      >
        <Save className="size-4" />
        {isPublishing ? "Publishing..." : "Save & Publish Quiz"}
      </Button>
    </div>
  );
}
