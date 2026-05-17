import { Save, Slash } from "lucide-react";

import BackButton from "@/components/UI/buttons/back-button";
import Button from "@/components/UI/buttons/button";

const breadcrumbs = [
  "Course Manager",
  "Exam",
  "Level A1 Beginner",
  "Quiz Builder",
];

const ListeningMiniQuizBuilderHeader = () => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <BackButton />

          <div className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <div key={item} className="flex items-center gap-2">
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
          Listening Mini Quiz Builder: Final Exam Level A1 Beginner
        </h1>

        <p className="mt-1 text-sm text-[#4F5B55]">
          Manage questions and interactive content for the Italian language
          module.
        </p>
      </div>

      <Button
        size="lg"
        className="gap-2 self-start px-8 shadow-lg shadow-[#006B3F]/20"
      >
        <Save className="size-4" />
        Save & Publish Quiz
      </Button>
    </div>
  );
};

export default ListeningMiniQuizBuilderHeader;
