import { ArrowLeft } from "lucide-react";

interface LessonEditHeaderProps {
  courseTitle?: string;
  lessonTitle: string;
  chapterTitle?: string;
  isEditMode: boolean;
  onBack: () => void;
}

export default function LessonEditHeader({
  courseTitle,
  lessonTitle,
  chapterTitle,
  isEditMode,
  onBack,
}: LessonEditHeaderProps) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#66736B]">
        <button
          type="button"
          onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm"
        >
          <ArrowLeft className="size-4" />
        </button>

        <span>Courses</span>
        <span>{">"}</span>

        <span>{courseTitle || "Course"}</span>

        <span>{">"}</span>
        <span>{chapterTitle || "Chapter"}</span>
        <span>{">"}</span>

        <span className="font-semibold text-[#006B3F]">
          {lessonTitle || "New Lesson"}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-[#202420] sm:text-3xl">
        {isEditMode ? "Edit Lesson Content" : "Create Lesson Content"}
      </h1>
    </div>
  );
}
