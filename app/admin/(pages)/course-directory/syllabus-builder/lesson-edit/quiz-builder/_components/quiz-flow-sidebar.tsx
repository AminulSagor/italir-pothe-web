import { Check, Pencil, Plus } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { QuizFlowQuestionMock } from "@/mock/quiz-builder/quiz-builder.types";

interface QuizFlowSidebarProps {
  questions: QuizFlowQuestionMock[];
  activeQuestionId: number;
  onQuestionSelect: (id: number) => void;
}

export default function QuizFlowSidebar({
  questions,
  activeQuestionId,
  onQuestionSelect,
}: QuizFlowSidebarProps) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1] xl:min-h-[760px]"
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#007A4A]">Quiz Flow</h2>
          <p className="text-xl font-semibold italic text-[#9BA59E]">
            {questions.length} Question
          </p>
          <p className="text-xs text-[#8A968E]">Italian Basics • Lesson 1.1</p>
        </div>

        <button
          type="button"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#62F25A] text-[#007A4A]"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => {
          const isActive = question.id === activeQuestionId;

          return (
            <button
              key={`${question.id}-${question.questionType}`}
              type="button"
              onClick={() => onQuestionSelect(question.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-full px-4 py-3 text-left transition ${
                isActive
                  ? "bg-[#007A4A] text-white"
                  : "bg-[#EEF3EC] text-[#202420] hover:bg-[#E5ECE3]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-[#DDF3E8] text-[#007A4A]"
                  }`}
                >
                  {index + 1}
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {question.title}
                  </span>
                  <span className="block truncate text-[10px] uppercase tracking-wide opacity-70">
                    {question.type}
                  </span>
                </span>
              </span>

              {isActive ? (
                <Pencil className="size-4 shrink-0" />
              ) : (
                <Check className="size-4 shrink-0 text-[#007A4A]" />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
