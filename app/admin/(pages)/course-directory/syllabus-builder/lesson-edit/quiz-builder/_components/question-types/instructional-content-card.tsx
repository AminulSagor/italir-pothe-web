"use client";

import { ListPlus } from "lucide-react";

import Card from "@/components/UI/cards/card";

type QuestionStatus = "draft" | "active" | "published" | "archived";

interface InstructionalContentCardProps {
  title: string;
  promptText: string;
  helperText: string;
  translationText: string;
  points: number;
  sortOrder: number;
  status: QuestionStatus;
  onTitleChange: (value: string) => void;
  onPromptTextChange: (value: string) => void;
  onHelperTextChange: (value: string) => void;
  onTranslationTextChange: (value: string) => void;
  onPointsChange: (value: number) => void;
  onSortOrderChange: (value: number) => void;
  onStatusChange: (value: QuestionStatus) => void;
}

export default function InstructionalContentCard({
  title,
  promptText,
  helperText,
  translationText,
  points,
  sortOrder,
  status,
  onTitleChange,
  onPromptTextChange,
  onHelperTextChange,
  onTranslationTextChange,
  onPointsChange,
  onSortOrderChange,
  onStatusChange,
}: InstructionalContentCardProps) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-5 flex items-center gap-3">
        <ListPlus className="size-5 text-[#007A4A]" />
        <h3 className="text-lg font-bold text-[#202420]">
          Instructional Content
        </h3>
      </div>

      <div className="grid gap-5">
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
            Question Title
          </span>

          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Enter question title..."
            className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />
        </label>

        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
            Prompt Text
          </span>

          <textarea
            value={promptText}
            onChange={(event) => onPromptTextChange(event.target.value)}
            maxLength={500}
            placeholder="Write the main question prompt..."
            className="min-h-32 w-full resize-none rounded-3xl bg-[#EEF3EC] p-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />

          <p className="mt-2 text-xs text-[#8A968E]">
            Character count: {promptText.length}/500
          </p>
        </label>

        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
            Helper Text
          </span>

          <textarea
            value={helperText}
            onChange={(event) => onHelperTextChange(event.target.value)}
            maxLength={500}
            placeholder="Write helper text for students..."
            className="min-h-24 w-full resize-none rounded-3xl border border-[#DDE6DD] p-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />
        </label>

        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
            Translation Text
          </span>

          <textarea
            value={translationText}
            onChange={(event) => onTranslationTextChange(event.target.value)}
            maxLength={500}
            placeholder="Write translation text if needed..."
            className="min-h-24 w-full resize-none rounded-3xl border border-[#DDE6DD] p-6 text-sm text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />
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
  );
}
