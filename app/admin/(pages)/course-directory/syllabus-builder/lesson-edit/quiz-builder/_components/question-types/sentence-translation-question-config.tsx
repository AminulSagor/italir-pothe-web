"use client";

import { KeyboardEvent, useMemo, useState } from "react";
import { Languages, X } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type {
  QuizQuestionSequenceItem,
  QuizQuestionStatus,
} from "@/types/course-directory/quiz.type";

interface SentenceTranslationQuestionConfigProps {
  promptText: string;
  translationText: string;
  sequenceItems: QuizQuestionSequenceItem[];
  points: number;
  sortOrder: number;
  status: QuizQuestionStatus;
  onPromptTextChange: (value: string) => void;
  onTranslationTextChange: (value: string) => void;
  onSequenceItemsChange: (items: QuizQuestionSequenceItem[]) => void;
  onPointsChange: (value: number) => void;
  onSortOrderChange: (value: number) => void;
  onStatusChange: (value: QuizQuestionStatus) => void;
}

const splitWords = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

const normalizeItems = (items: QuizQuestionSequenceItem[]) =>
  items.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));

const buildRequiredItemsFromTranslation = (
  translationText: string,
  existingItems: QuizQuestionSequenceItem[],
): QuizQuestionSequenceItem[] => {
  const requiredWords = splitWords(translationText);

  const requiredItems: QuizQuestionSequenceItem[] = requiredWords.map(
    (word, index) => {
      const existingItem = existingItems.find(
        (item) => item.isRequired && item.wordText === word,
      );

      return {
        ...existingItem,
        wordText: word,
        isRequired: true,
        sortOrder: index + 1,
      };
    },
  );

  const decoyItems = existingItems.filter((item) => !item.isRequired);

  return normalizeItems([...requiredItems, ...decoyItems]);
};

export default function SentenceTranslationQuestionConfig({
  promptText,
  translationText,
  sequenceItems,
  points,
  sortOrder,
  status,
  onPromptTextChange,
  onTranslationTextChange,
  onSequenceItemsChange,
  onPointsChange,
  onSortOrderChange,
  onStatusChange,
}: SentenceTranslationQuestionConfigProps) {
  const [decoyInput, setDecoyInput] = useState("");

  const requiredItems = useMemo(
    () => sequenceItems.filter((item) => item.isRequired),
    [sequenceItems],
  );

  const decoyItems = useMemo(
    () => sequenceItems.filter((item) => !item.isRequired),
    [sequenceItems],
  );

  const handleTranslationChange = (value: string) => {
    onTranslationTextChange(value);
    onSequenceItemsChange(
      buildRequiredItemsFromTranslation(value, sequenceItems),
    );
  };

  const handleAddDecoy = () => {
    const nextWord = decoyInput.trim();

    if (!nextWord) return;

    const nextItems = normalizeItems([
      ...sequenceItems,
      {
        wordText: nextWord,
        isRequired: false,
        sortOrder: sequenceItems.length + 1,
      },
    ]);

    onSequenceItemsChange(nextItems);
    setDecoyInput("");
  };

  const handleDecoyKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    event.preventDefault();
    handleAddDecoy();
  };

  const handleRemoveDecoy = (itemIndex: number) => {
    const targetItem = decoyItems[itemIndex];

    const nextItems = sequenceItems.filter((item) => item !== targetItem);

    onSequenceItemsChange(normalizeItems(nextItems));
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#62F25A]/20">
          <Languages className="size-5 text-[#007A4A]" />
        </div>

        <h3 className="text-xl font-bold text-[#202420]">
          Italian Translation Assembly
        </h3>
      </div>

      <div className="space-y-7">
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#8A968E]">
            Sentence To Translate
          </span>

          <input
            value={promptText}
            onChange={(event) => onPromptTextChange(event.target.value)}
            placeholder="Type the sentence in English"
            className="h-20 w-full rounded-full bg-[#EEF3EC] px-8 text-lg font-semibold text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />
        </label>

        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#8A968E]">
            Exact Translation
          </span>

          <input
            value={translationText}
            onChange={(event) => handleTranslationChange(event.target.value)}
            placeholder="Type the exact translation"
            className="h-20 w-full rounded-full bg-[#EEF3EC] px-8 text-lg font-semibold text-[#202420] outline-none placeholder:text-[#A8B2AA]"
          />
        </label>

        <div>
          <span className="mb-3 block text-[10px] font-bold uppercase text-[#8A968E]">
            App Preview (Pills)
          </span>

          <div className="flex min-h-24 flex-wrap items-center justify-center gap-3 rounded-full bg-[#EEF3EC] px-8 py-5">
            {requiredItems.length ? (
              requiredItems.map((item, index) => (
                <span
                  key={`${item.wordText}-${index}`}
                  className="rounded-full bg-white px-6 py-3 text-base font-bold text-[#202420] shadow-sm"
                >
                  {item.wordText}
                </span>
              ))
            ) : (
              <span className="text-sm font-medium text-[#8A968E]">
                Translation words will appear here.
              </span>
            )}
          </div>
        </div>

        <div>
          <span className="mb-3 block text-[10px] font-bold uppercase text-[#8A968E]">
            Add Decoy Words
          </span>

          <div className="flex min-h-20 flex-wrap items-center gap-3 rounded-3xl border border-[#DDE6DD] bg-white px-5 py-4">
            {decoyItems.map((item, index) => (
              <button
                key={`${item.wordText}-${index}`}
                type="button"
                onClick={() => handleRemoveDecoy(index)}
                className="inline-flex items-center gap-2 rounded-full bg-[#EEF3EC] px-4 py-2 text-sm font-bold text-[#202420]"
              >
                {item.wordText}
                <X className="size-3 text-[#66736B]" />
              </button>
            ))}

            <input
              value={decoyInput}
              onChange={(event) => setDecoyInput(event.target.value)}
              onKeyDown={handleDecoyKeyDown}
              onBlur={handleAddDecoy}
              placeholder="Type and press enter to add..."
              className="min-w-56 flex-1 bg-transparent text-sm text-[#202420] outline-none placeholder:text-[#8A968E]"
            />
          </div>
        </div>

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
      </div>
    </Card>
  );
}
