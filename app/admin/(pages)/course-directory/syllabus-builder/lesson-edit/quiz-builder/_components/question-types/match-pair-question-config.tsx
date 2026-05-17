"use client";

import { useState } from "react";
import { GitCompareArrows, Plus, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import Button from "@/components/UI/buttons/button";

interface PairItem {
  id: number;
  italian: string;
  english: string;
}

const initialPairs: PairItem[] = [
  {
    id: 1,
    italian: "La Mela",
    english: "Apple",
  },
  {
    id: 2,
    italian: "Pane",
    english: "Bread",
  },
  {
    id: 3,
    italian: "Acqua",
    english: "Water",
  },
];

export default function MatchPairQuestionConfig() {
  const [pairs, setPairs] = useState<PairItem[]>(initialPairs);

  const handleAddPair = () => {
    setPairs((prev) => [
      ...prev,
      {
        id: Date.now(),
        italian: "",
        english: "",
      },
    ]);
  };

  const handleUpdatePair = (
    id: number,
    field: "italian" | "english",
    value: string,
  ) => {
    setPairs((prev) =>
      prev.map((pair) =>
        pair.id === id
          ? {
              ...pair,
              [field]: value,
            }
          : pair,
      ),
    );
  };

  const handleDeletePair = (id: number) => {
    setPairs((prev) => prev.filter((pair) => pair.id !== id));
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#DDF3E8]">
            <GitCompareArrows className="size-5 text-[#007A4A]" />
          </div>

          <h3 className="text-2xl font-bold text-[#007A4A]">Pair Management</h3>
        </div>

        <span className="rounded-full bg-[#EEF3EC] px-4 py-2 text-xs font-semibold text-[#66736B]">
          {pairs.length} Pairs Total
        </span>
      </div>

      <div className="space-y-4">
        {pairs.map((pair) => (
          <div
            key={pair.id}
            className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_56px]"
          >
            <div className="relative">
              <input
                value={pair.italian}
                onChange={(event) =>
                  handleUpdatePair(pair.id, "italian", event.target.value)
                }
                placeholder="Italian term..."
                className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 pr-24 text-lg font-medium text-[#202420] outline-none placeholder:text-[#8A968E]"
              />

              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-[#8FC3A9]">
                Italian
              </span>
            </div>

            <div className="relative">
              <input
                value={pair.english}
                onChange={(event) =>
                  handleUpdatePair(pair.id, "english", event.target.value)
                }
                placeholder="English translation..."
                className="h-14 w-full rounded-full border border-[#8FC3A9] bg-[#EEF3EC] px-6 pr-24 text-lg font-medium text-[#202420] outline-none placeholder:text-[#8A968E]"
              />

              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-[#8FC3A9]">
                English
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDeletePair(pair.id)}
              className="flex size-14 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E53935] transition hover:bg-[#FFE4E4]"
            >
              <Trash2 className="size-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddPair}
          className="flex min-h-36 w-full flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-[#B9E2CA] transition hover:bg-[#F8FCF8]"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#007A4A] text-white">
            <Plus className="size-6" />
          </div>

          <p className="text-lg font-semibold text-[#007A4A]">Add New Pair</p>
        </button>

        <div className="border-t border-[#E2E8E1] pt-6">
          <p className="text-center text-[10px] font-semibold uppercase tracking-wide text-[#A0AAA3]">
            Pairs will be automatically shuffled for the student
          </p>
        </div>
      </div>
    </Card>
  );
}
