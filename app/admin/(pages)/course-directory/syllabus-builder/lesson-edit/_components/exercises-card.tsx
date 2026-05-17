import { ChevronRight, Languages, NotebookText, Puzzle } from "lucide-react";

import Card from "@/components/UI/cards/card";
import Link from "next/link";

export default function ExercisesCard() {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-7 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#DFF8DC]">
          <Puzzle className="size-4 text-[#009F5A]" />
        </div>
        <h2 className="text-lg font-bold text-[#202420]">Exercises</h2>
      </div>

      <div className="space-y-4">
        <Link
          href="/admin/course-directory/syllabus-builder/lesson-edit/manage-vocabulary"
          className="flex w-full items-center justify-between gap-3 rounded-full border border-[#DDE6DD] bg-[#F7FBF4] px-5 py-3 text-sm font-semibold text-[#202420]"
        >
          <span className="flex items-center gap-3">
            <Languages className="size-5 text-[#007A4A]" />
            Manage Vocabulary
          </span>

          <ChevronRight className="size-4 text-[#A5B0A8]" />
        </Link>

        <Link
          href="/admin/course-directory/syllabus-builder/lesson-edit/quiz-builder"
          className="flex w-full items-center justify-between gap-3 rounded-full border border-[#DDE6DD] bg-[#F7FBF4] px-5 py-3 text-sm font-semibold text-[#202420]"
        >
          <span className="flex items-center gap-3">
            <NotebookText className="size-5 text-[#007A4A]" />
            Manage Quiz
          </span>

          <ChevronRight className="size-4 text-[#A5B0A8]" />
        </Link>
      </div>
    </Card>
  );
}
