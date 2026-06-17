"use client";

import { ListPlus, Plus, Settings2, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionOption } from "@/types/course-directory/quiz.type";

interface WordTranslationQuestionConfigProps {
  title: string;
  promptText: string;
  options: QuizQuestionOption[];
  onTitleChange: (value: string) => void;
  onPromptTextChange: (value: string) => void;
  onOptionsChange: (options: QuizQuestionOption[]) => void;
}

export default function WordTranslationQuestionConfig({
  title,
  promptText,
  options,
  onTitleChange,
  onPromptTextChange,
  onOptionsChange,
}: WordTranslationQuestionConfigProps) {
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
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#DDF3E8]">
          <ListPlus className="size-5 text-[#007A4A]" />
        </div>

        <h3 className="text-2xl font-bold text-[#007A4A]">Word Translation</h3>
      </div>

      <div className="space-y-6">
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
            Subtitle Field
          </span>

          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Translate the word"
            className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm font-semibold text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />
        </label>

        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
            Main Question Text
          </span>

          <input
            value={promptText}
            onChange={(event) => onPromptTextChange(event.target.value)}
            placeholder='How do you say "Hello" in Italian?'
            className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />
        </label>

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-bold uppercase text-[#66736B]">
              Answer Options (Decoys & Correct Answer)
            </p>

            <button
              type="button"
              onClick={addOption}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#007A4A]"
            >
              <Plus className="size-4" />
              Add Option
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => {
              const isCorrect = option.isCorrect;

              return (
                <div
                  key={`${option.id || "word-option"}-${index}`}
                  className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-full border px-5 text-sm font-semibold transition ${
                    isCorrect
                      ? "border-[#62F25A] bg-[#EFFFF0] text-[#202420]"
                      : "border-transparent bg-[#EEF3EC] text-[#202420]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => markCorrect(index)}
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
                      isCorrect
                        ? "border-[#62F25A] bg-[#62F25A]"
                        : "border-[#BFCBC3] bg-transparent"
                    }`}
                    aria-label="Mark option as correct"
                  >
                    {isCorrect && (
                      <span className="size-3 rounded-full bg-[#007A4A]" />
                    )}
                  </button>

                  <input
                    value={option.optionText}
                    onChange={(event) =>
                      updateOption(index, { optionText: event.target.value })
                    }
                    placeholder={`Option ${index + 1}`}
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8A968E]"
                  />

                  {isCorrect ? (
                    <Settings2 className="size-5 shrink-0 text-[#007A4A]" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="shrink-0 text-[#66736B] hover:text-[#D83324]"
                      aria-label="Remove option"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
