import { ChevronDown, Settings } from "lucide-react";

import type { QuizQuestionType } from "@/types/course-directory/quiz.type";

interface QuestionTypeOption {
  label: string;
  value: QuizQuestionType;
}

interface QuestionConfigurationHeaderProps {
  title: string;
  format: string;
  questionTypes: QuestionTypeOption[];
  selectedQuestionType: QuizQuestionType;
  onQuestionTypeChange: (value: QuizQuestionType) => void;
}

export default function QuestionConfigurationHeader({
  title,
  questionTypes,
  selectedQuestionType,
  onQuestionTypeChange,
}: QuestionConfigurationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#E3F4EA]">
          <Settings className="size-5 text-[#007A4A]" />
        </div>

        <h2 className="text-xl font-bold text-[#202420]">{title}</h2>
      </div>

      <div className="sm:text-right">
        <p className="mb-1 text-[10px] font-bold uppercase text-[#8A968E]">
          Question Format
        </p>

        <div className="relative">
          <select
            value={selectedQuestionType}
            onChange={(event) =>
              onQuestionTypeChange(event.target.value as QuizQuestionType)
            }
            className="h-10 w-full appearance-none rounded-full bg-[#EEF5EC] px-5 pr-10 text-sm font-semibold text-[#007A4A] outline-none sm:w-[230px]"
          >
            {questionTypes.map((questionType) => (
              <option key={questionType.value} value={questionType.value}>
                {questionType.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#007A4A]" />
        </div>
      </div>
    </div>
  );
}
