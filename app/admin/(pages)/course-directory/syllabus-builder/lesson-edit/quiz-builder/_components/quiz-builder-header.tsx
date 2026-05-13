import { Save } from "lucide-react";

import BackButton from "@/components/UI/buttons/back-button";
import Button from "@/components/UI/buttons/button";

export default function QuizBuilderHeader() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#7A867D]">
          <BackButton />

          <span>Courses</span>
          <span>/</span>
          <span>Level A1</span>
          <span>/</span>
          <span>Chapter 1</span>
          <span>/</span>
          <span>Lesson 1.1</span>
          <span>/</span>
          <span className="text-[#007A4A]">Quiz Builder</span>
        </div>

        <h1 className="text-2xl font-bold text-[#007A4A] sm:text-3xl">
          Quiz Builder: Lesson 1.1
        </h1>

        <p className="mt-1 text-sm text-[#66736B]">
          Manage questions and interactive content for the Italian language
          module.
        </p>
      </div>

      <Button size="md" className="w-full gap-2 sm:w-fit">
        <Save className="size-4" />
        Save & Publish Quiz
      </Button>
    </div>
  );
}
