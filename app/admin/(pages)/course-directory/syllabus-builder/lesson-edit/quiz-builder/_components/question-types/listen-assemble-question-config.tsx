"use client";

import { KeyboardEvent, useMemo, useState } from "react";
import { Puzzle, X } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionSequenceItem } from "@/types/course-directory/quiz.type";

interface ListenAssembleQuestionConfigProps {
  promptText: string;
  sequenceItems: QuizQuestionSequenceItem[];
  onPromptTextChange: (value: string) => void;
  onSequenceItemsChange: (items: QuizQuestionSequenceItem[]) => void;
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

const buildRequiredItemsFromPrompt = (
  promptText: string,
  existingItems: QuizQuestionSequenceItem[],
): QuizQuestionSequenceItem[] => {
  const requiredWords = splitWords(promptText);

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

export default function ListenAssembleQuestionConfig({
  promptText,
  sequenceItems,
  onPromptTextChange,
  onSequenceItemsChange,
}: ListenAssembleQuestionConfigProps) {
  const [decoyInput, setDecoyInput] = useState("");

  const requiredItems = useMemo(
    () => sequenceItems.filter((item) => item.isRequired),
    [sequenceItems],
  );

  const decoyItems = useMemo(
    () => sequenceItems.filter((item) => !item.isRequired),
    [sequenceItems],
  );

  const handlePromptChange = (value: string) => {
    onPromptTextChange(value);
    onSequenceItemsChange(buildRequiredItemsFromPrompt(value, sequenceItems));
  };

  const handleAddDecoy = () => {
    const nextWord = decoyInput.trim();

    if (!nextWord) return;

    onSequenceItemsChange(
      normalizeItems([
        ...sequenceItems,
        {
          wordText: nextWord,
          isRequired: false,
          sortOrder: sequenceItems.length + 1,
        },
      ]),
    );
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
          <Puzzle className="size-5 text-[#007A4A]" />
        </div>

        <h3 className="text-2xl font-bold text-[#202420]">
          Transcription Assembly
        </h3>
      </div>

      <div className="space-y-7">
        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#8A968E]">
            Sentence To Assemble
          </span>

          <div className="rounded-full bg-[#EEF3EC] px-8 py-5">
            <p className="mb-2 text-xs font-medium text-[#8A968E]">
              Audio Text will be placed here and turned into pills (You Can
              Manually Write them as well)
            </p>

            <input
              value={promptText}
              onChange={(event) => handlePromptChange(event.target.value)}
              placeholder="Type the sentence to assemble"
              className="h-9 w-full bg-transparent text-lg font-semibold text-[#007A4A] outline-none placeholder:text-[#A8B2AA]"
            />
          </div>
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
                Sentence words will appear here.
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
      </div>
    </Card>
  );
}
