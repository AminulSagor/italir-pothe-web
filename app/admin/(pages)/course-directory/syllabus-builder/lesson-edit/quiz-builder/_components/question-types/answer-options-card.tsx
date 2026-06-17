"use client";

import { Check, ListChecks, Plus, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionOption } from "@/types/course-directory/quiz.type";

interface AnswerOptionsCardProps {
  options: QuizQuestionOption[];
  onOptionsChange: (options: QuizQuestionOption[]) => void;
}

export default function AnswerOptionsCard({
  options,
  onOptionsChange,
}: AnswerOptionsCardProps) {
  const createEmptyOption = (sortOrder: number): QuizQuestionOption => ({
    optionText: "",
    isCorrect: options.length === 0,
    sortOrder,
  });

  const updateOption = (
    optionIndex: number,
    patch: Partial<QuizQuestionOption>,
  ) => {
    onOptionsChange(
      options.map((option, index) =>
        index === optionIndex ? { ...option, ...patch } : option,
      ),
    );
  };

  const markCorrect = (optionIndex: number) => {
    onOptionsChange(
      options.map((option, index) => ({
        ...option,
        isCorrect: index === optionIndex,
      })),
    );
  };

  const addOption = () => {
    onOptionsChange([...options, createEmptyOption(options.length + 1)]);
  };

  const removeOption = (optionIndex: number) => {
    const filteredOptions = options.filter((_, index) => index !== optionIndex);

    const hasCorrectOption = filteredOptions.some((option) => option.isCorrect);

    const nextOptions = filteredOptions.map((option, index) => ({
      ...option,
      sortOrder: index + 1,
      isCorrect: option.isCorrect || (!hasCorrectOption && index === 0),
    }));

    onOptionsChange(nextOptions);
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#E4F8EB]">
            <ListChecks className="size-5 text-[#007A4A]" />
          </div>

          <h3 className="text-lg font-bold text-[#007A4A]">Answer Options</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#DFF8DC] px-6 py-2 text-[10px] font-bold uppercase tracking-wide text-[#007A4A]">
            Place Correct Answer & Decoys
          </span>

          <button
            type="button"
            onClick={addOption}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-[#DFF8DC] px-4 text-xs font-bold uppercase text-[#007A4A]"
          >
            <Plus className="size-3" />
            Add Option
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {options.map((option, index) => {
          const isCorrect = option.isCorrect;

          return (
            <div
              key={`${option.id || "option"}-${index}`}
              className={`group flex min-h-16 items-center gap-4 rounded-full border px-5 transition ${
                isCorrect
                  ? "border-[#007A4A] bg-[#F1FBF4] shadow-[0_8px_20px_rgba(0,107,63,0.08)]"
                  : "border-[#DDE6DD] bg-[#EEF3EC]"
              }`}
            >
              <button
                type="button"
                onClick={() => markCorrect(index)}
                className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition ${
                  isCorrect
                    ? "border-[#007A4A] bg-[#007A4A] text-white"
                    : "border-[#BFCBC3] bg-white text-transparent"
                }`}
                aria-label="Mark as correct answer"
              >
                {isCorrect ? (
                  <Check className="size-4 stroke-[3]" />
                ) : (
                  <span className="size-2 rounded-full bg-[#BFCBC3]" />
                )}
              </button>

              <input
                value={option.optionText}
                onChange={(event) =>
                  updateOption(index, { optionText: event.target.value })
                }
                placeholder={`Option ${index + 1}`}
                className="min-w-0 flex-1 bg-transparent text-base font-bold text-[#202420] outline-none placeholder:text-[#8A968E]"
              />

              {isCorrect && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#007A4A] text-white">
                  <Check className="size-4 stroke-[3]" />
                </div>
              )}

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#9AA69E] opacity-100 transition hover:bg-[#FFE6E3] hover:text-[#D92D20] md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Remove option"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
