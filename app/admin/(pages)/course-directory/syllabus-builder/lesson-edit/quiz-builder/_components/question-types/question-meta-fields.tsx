"use client";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionStatus } from "@/types/course-directory/quiz.type";

interface QuestionMetaFieldsProps {
  points: number;
  sortOrder: number;
  status: QuizQuestionStatus;
  onPointsChange: (value: number) => void;
  onSortOrderChange: (value: number) => void;
  onStatusChange: (value: QuizQuestionStatus) => void;
}

export default function QuestionMetaFields({
  points,
  sortOrder,
  status,
  onPointsChange,
  onSortOrderChange,
  onStatusChange,
}: QuestionMetaFieldsProps) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
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
            min={1}
            value={sortOrder}
            onChange={(event) => onSortOrderChange(Number(event.target.value))}
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
              onStatusChange(event.target.value as QuizQuestionStatus)
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
    </Card>
  );
}
