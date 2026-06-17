"use client";

import { Check, CircleX, ListPlus } from "lucide-react";

import Card from "@/components/UI/cards/card";

type QuestionStatus = "draft" | "active" | "published" | "archived";

interface TrueFalseQuestionConfigProps {
  promptText: string;
  translationText: string;
  points: number;
  sortOrder: number;
  status: QuestionStatus;
  correctBoolean: boolean;
  onPromptTextChange: (value: string) => void;
  onTranslationTextChange: (value: string) => void;
  onPointsChange: (value: number) => void;
  onSortOrderChange: (value: number) => void;
  onStatusChange: (value: QuestionStatus) => void;
  onCorrectBooleanChange: (value: boolean) => void;
}

export default function TrueFalseQuestionConfig({
  promptText,
  translationText,
  points,
  sortOrder,
  status,
  correctBoolean,
  onPromptTextChange,
  onTranslationTextChange,
  onPointsChange,
  onSortOrderChange,
  onStatusChange,
  onCorrectBooleanChange,
}: TrueFalseQuestionConfigProps) {
  return (
    <div className="space-y-6">
      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        <div className="mb-5 flex items-center gap-3">
          <ListPlus className="size-5 text-[#007A4A]" />
          <h3 className="text-lg font-bold text-[#202420]">Question Text</h3>
        </div>

        <div className="grid gap-5">
          <label>
            <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
              Question Text
            </span>

            <textarea
              value={promptText}
              onChange={(event) => onPromptTextChange(event.target.value)}
              maxLength={500}
              placeholder="Enter the statement that students need to evaluate..."
              className="min-h-32 w-full resize-none rounded-3xl bg-[#EEF3EC] p-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
            />

            <p className="mt-2 text-xs text-[#8A968E]">
              Character count: {promptText.length}/500
            </p>
          </label>

          <label>
            <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
              Translation
            </span>

            <textarea
              value={translationText}
              onChange={(event) => onTranslationTextChange(event.target.value)}
              maxLength={500}
              placeholder="Write the Translation"
              className="min-h-28 w-full resize-none rounded-3xl border border-[#DDE6DD] p-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
            />

            <p className="mt-2 text-xs text-[#8A968E]">
              Character count: {translationText.length}/500
            </p>
          </label>

          <div className="grid gap-5 sm:grid-cols-3">
            <label>
              <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
                Points
              </span>

              <input
                type="number"
                min={1}
                value={points}
                onChange={(event) => onPointsChange(Number(event.target.value))}
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
              />
            </label>

            <label>
              <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
                Sort Order
              </span>

              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(event) =>
                  onSortOrderChange(Number(event.target.value))
                }
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
              />
            </label>

            <label>
              <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
                Status
              </span>

              <select
                value={status}
                onChange={(event) =>
                  onStatusChange(event.target.value as QuestionStatus)
                }
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </div>
      </Card>

      <Card
        padding="lg"
        rounded="3xl"
        shadow="sm"
        className="border border-[#E2E8E1]"
      >
        <div className="mb-8 flex items-center gap-3">
          <Check className="size-5 text-[#007A4A]" />

          <h3 className="text-lg font-bold text-[#202420]">Answer Key</h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onCorrectBooleanChange(false)}
            className={`relative flex h-44 flex-col items-center justify-center rounded-3xl font-bold ${
              !correctBoolean
                ? "bg-[#007A4A] text-white"
                : "bg-[#EEF3EC] text-[#526057]"
            }`}
          >
            <CircleX className="mb-4 size-10" />
            False
            {!correctBoolean && (
              <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase text-[#007A4A]">
                Correct
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onCorrectBooleanChange(true)}
            className={`relative flex h-44 flex-col items-center justify-center rounded-3xl font-bold ${
              correctBoolean
                ? "bg-[#007A4A] text-white"
                : "bg-[#EEF3EC] text-[#526057]"
            }`}
          >
            <Check className="mb-4 size-10" />
            True
            {correctBoolean && (
              <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase text-[#007A4A]">
                Correct
              </span>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-[#8A968E]">
          Click a card to set it as the correct answer.
        </p>
      </Card>
    </div>
  );
}
