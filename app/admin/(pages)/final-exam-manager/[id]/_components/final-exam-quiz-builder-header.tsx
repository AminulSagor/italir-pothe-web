import { ArrowLeft, Save, Slash } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface FinalExamQuizBuilderHeaderProps {
  courseTitle: string;
  examTitle: string;
  builderTitle: string;
  description: string;
  isPublishing?: boolean;
  onBack: () => void;
  onPublish: () => void;
}

const FinalExamQuizBuilderHeader = ({
  courseTitle,
  examTitle,
  builderTitle,
  description,
  isPublishing = false,
  onBack,
  onPublish,
}: FinalExamQuizBuilderHeaderProps) => {
  const breadcrumbs = [
    "Course Manager",
    "Exam",
    courseTitle || "Linked Course",
    "Quiz Builder",
  ];

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#F4F7F4]"
          >
            <ArrowLeft className="size-4 text-[#006B3F]" />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`text-xs font-medium uppercase tracking-[0.18em] ${
                      isLast ? "text-[#006B3F]" : "text-[#7A8580]"
                    }`}
                  >
                    {item}
                  </span>

                  {!isLast && <Slash className="size-3 text-[#A8B2AD]" />}
                </div>
              );
            })}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#006B3F] md:text-3xl">
          {builderTitle || `Quiz Builder: ${examTitle}`}
        </h1>

        <p className="mt-1 text-sm text-[#4F5B55] md:text-base">
          {description}
        </p>
      </div>

      <Button
        size="lg"
        disabled={isPublishing}
        onClick={onPublish}
        className="gap-2 self-start px-8 shadow-lg shadow-[#006B3F]/20"
      >
        <Save className="size-4" />
        {isPublishing ? "Publishing..." : "Save & Publish Quiz"}
      </Button>
    </div>
  );
};

export default FinalExamQuizBuilderHeader;
