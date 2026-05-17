import { Check, Circle, ListChecks } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { QuizAnswerOptionMock } from "@/mock/quiz-builder/quiz-builder.types";

interface AnswerOptionsCardProps {
  options: QuizAnswerOptionMock[];
}

export default function AnswerOptionsCard({ options }: AnswerOptionsCardProps) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ListChecks className="size-5 text-[#007A4A]" />
          <h3 className="text-sm font-semibold text-[#007A4A]">
            Answer Options
          </h3>
        </div>

        <span className="w-fit rounded-full bg-[#DFF8DC] px-4 py-2 text-[10px] font-bold uppercase text-[#007A4A]">
          Place Correct Answer & Decoys
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`flex h-14 items-center justify-between rounded-full border px-5 text-sm font-bold ${
              option.isCorrect
                ? "border-[#007A4A] bg-white text-[#202420] shadow-sm"
                : "border-[#DDE6DD] bg-[#EEF3EC] text-[#202420]"
            }`}
          >
            <span className="flex items-center gap-3">
              {option.isCorrect ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-[#007A4A]">
                  <span className="size-2 rounded-full bg-white" />
                </span>
              ) : (
                <Circle className="size-6 text-[#C5D0C8]" />
              )}

              {option.label}
            </span>

            {option.isCorrect && (
              <span className="flex size-7 items-center justify-center rounded-full bg-[#007A4A] text-white">
                <Check className="size-4" />
              </span>
            )}
          </button>
        ))}
      </div>
    </Card>
  );
}
