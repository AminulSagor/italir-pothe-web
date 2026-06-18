"use client";

import { Eye, Plus, Settings, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionOption } from "@/types/course-directory/quiz.type";

interface FillBlanksQuestionConfigProps {
  sentence: string;
  options: QuizQuestionOption[];
  onSentenceChange: (value: string) => void;
  onOptionsChange: (options: QuizQuestionOption[]) => void;
}

const buildPreviewParts = (sentence: string) => {
  const match = sentence.match(/\[(.*?)\]/);

  if (!match) {
    return {
      before: sentence || "Write sentence with [answer]...",
      answer: "",
      after: "",
    };
  }

  const answer = match[1] || "";
  const [before, after = ""] = sentence.split(match[0]);

  return {
    before,
    answer,
    after,
  };
};

export default function FillBlanksQuestionConfig({
  sentence,
  options,
  onSentenceChange,
  onOptionsChange,
}: FillBlanksQuestionConfigProps) {
  const correctOption =
    options.find((option) => option.isCorrect)?.optionText || "";

  const preview = buildPreviewParts(sentence);

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
    onOptionsChange([
      ...options,
      {
        optionText: "",
        isCorrect: options.length === 0,
        sortOrder: options.length + 1,
      },
    ]);
  };

  const removeOption = (optionIndex: number) => {
    const nextOptions = options
      .filter((_, index) => index !== optionIndex)
      .map((option, index) => ({
        ...option,
        isCorrect: option.isCorrect || index === 0,
        sortOrder: index + 1,
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
      <div className="mb-6 flex items-center gap-3">
        <Settings className="size-5 text-[#007A4A]" />
        <h3 className="text-lg font-bold text-[#202420]">
          Fill in The Blanks Configuration
        </h3>
      </div>

      <label>
        <span className="mb-2 block text-[10px] font-bold uppercase text-[#8A968E]">
          Sentence Builder
        </span>

        <p className="mb-3 text-xs font-medium text-[#8A968E]">
          Use square brackets [ ] to define the blank field.
        </p>

        <textarea
          value={sentence}
          onChange={(event) => onSentenceChange(event.target.value)}
          placeholder="Example: Io [vorrei] un caffè."
          className="min-h-36 w-full resize-none rounded-3xl border border-[#DDF3E8] bg-white p-6 text-lg outline-none placeholder:text-[#A8B2AA]"
        />
      </label>

      <div className="my-7 rounded-3xl bg-[#EEF3EC] p-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-[#007A4A]">
          <Eye className="size-4" />
          Live App Preview
        </div>

        <div className="rounded-full bg-white px-8 py-6 text-center text-xl">
          {preview.before}{" "}
          <span className="mx-4 inline-block min-w-20 border-b-4 border-[#9FC8B5] tracking-[8px] text-[#9FC8B5]">
            .....
          </span>{" "}
          {preview.after}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] font-bold uppercase text-[#8A968E]">
          Answer Options & Correct Key
        </p>

        <button
          type="button"
          onClick={addOption}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#007A4A]"
        >
          <Plus className="size-4" />
          Add Option
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option, index) => {
          const isCorrect = option.isCorrect;

          return (
            <div
              key={`${option.id || "blank-option"}-${index}`}
              className={`flex min-h-14 items-center gap-3 rounded-full border px-5 ${
                isCorrect
                  ? "border-[#007A4A] bg-[#E9FFF0] text-[#007A4A]"
                  : "border-transparent bg-[#EEF3EC] text-[#202420]"
              }`}
            >
              <button
                type="button"
                onClick={() => markCorrect(index)}
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                  isCorrect
                    ? "border-[#007A4A] bg-[#007A4A]"
                    : "border-[#BFCBC3] bg-white"
                }`}
                aria-label="Mark option as correct"
              >
                {isCorrect && <span className="size-2 rounded-full bg-white" />}
              </button>

              <input
                value={option.optionText}
                onChange={(event) =>
                  updateOption(index, { optionText: event.target.value })
                }
                placeholder={`Option ${index + 1}`}
                className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-[#8A968E]"
              />

              {isCorrect ? (
                <span className="text-[10px] uppercase">Correct</span>
              ) : (
                <span className="text-[10px] text-[#8A968E]">
                  Decoy Option {index + 1}
                </span>
              )}

              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-[#8A968E] hover:text-[#D83324]"
                aria-label="Remove option"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      {correctOption && (
        <p className="mt-5 text-xs text-[#66736B]">
          Correct answer saved to API option key:{" "}
          <span className="font-semibold text-[#007A4A]">{correctOption}</span>
        </p>
      )}
    </Card>
  );
}
