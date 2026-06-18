"use client";

import { Plus, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { QuizQuestionPair } from "@/types/course-directory/quiz.type";

interface MatchPairQuestionConfigProps {
  pairs: QuizQuestionPair[];
  onPairsChange: (pairs: QuizQuestionPair[]) => void;
}

export default function MatchPairQuestionConfig({
  pairs,
  onPairsChange,
}: MatchPairQuestionConfigProps) {
  const updatePair = (pairIndex: number, patch: Partial<QuizQuestionPair>) => {
    onPairsChange(
      pairs.map((pair, index) =>
        index === pairIndex ? { ...pair, ...patch } : pair,
      ),
    );
  };

  const addPair = () => {
    onPairsChange([
      ...pairs,
      {
        leftText: "",
        rightText: "",
        leftLabel: "Italian",
        rightLabel: "English",
        sortOrder: pairs.length + 1,
      },
    ]);
  };

  const removePair = (pairIndex: number) => {
    onPairsChange(
      pairs
        .filter((_, index) => index !== pairIndex)
        .map((pair, index) => ({
          ...pair,
          sortOrder: index + 1,
        })),
    );
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-[#007A4A]">Pair Management</h3>

        <button
          type="button"
          onClick={addPair}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#007A4A] px-5 text-sm font-semibold text-white"
        >
          <Plus className="size-4" />
          Add Pair
        </button>
      </div>

      <div className="mb-3 grid gap-4 px-2 text-[10px] font-bold uppercase text-[#8A968E] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_56px]">
        <span>Italian</span>
        <span>English</span>
        <span />
      </div>

      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <div
            key={`${pair.id || "pair"}-${index}`}
            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_56px]"
          >
            <label className="block">
              <span className="sr-only">Italian word</span>
              <input
                value={pair.leftText}
                onChange={(event) =>
                  updatePair(index, {
                    leftText: event.target.value,
                    leftLabel: "Italian",
                  })
                }
                placeholder="Italian term..."
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-lg font-medium text-[#202420] outline-none placeholder:text-[#8A968E]"
              />
            </label>

            <label className="block">
              <span className="sr-only">English meaning</span>
              <input
                value={pair.rightText}
                onChange={(event) =>
                  updatePair(index, {
                    rightText: event.target.value,
                    rightLabel: "English",
                  })
                }
                placeholder="English translation..."
                className="h-14 w-full rounded-full border border-[#8FC3A9] bg-[#EEF3EC] px-6 text-lg font-medium text-[#202420] outline-none placeholder:text-[#8A968E]"
              />
            </label>

            <button
              type="button"
              onClick={() => removePair(index)}
              className="flex size-14 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D83324]"
              aria-label="Remove pair"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
