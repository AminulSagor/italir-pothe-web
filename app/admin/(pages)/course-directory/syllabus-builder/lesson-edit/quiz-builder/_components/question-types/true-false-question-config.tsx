"use client";

import { useState } from "react";
import { Check, CircleX, Languages, ListPlus } from "lucide-react";

import Card from "@/components/UI/cards/card";

export default function TrueFalseQuestionConfig() {
  const [questionText, setQuestionText] = useState("");
  const [translation, setTranslation] = useState("");
  const [answer, setAnswer] = useState<"true" | "false">("true");

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

        <textarea
          value={questionText}
          onChange={(event) => setQuestionText(event.target.value)}
          maxLength={500}
          placeholder="Enter the statement that students need to evaluate..."
          className="min-h-36 w-full resize-none rounded-3xl bg-[#EEF3EC] p-6 text-sm outline-none placeholder:text-[#7A867D]"
        />

        <p className="mt-3 text-xs text-[#8A968E]">
          Character count: {questionText.length}/500
        </p>

        <div className="mt-8 mb-5 flex items-center gap-3">
          <Languages className="size-5 text-[#B64A4A]" />
          <h3 className="text-lg font-bold text-[#202420]">Translation</h3>
        </div>

        <textarea
          value={translation}
          onChange={(event) => setTranslation(event.target.value)}
          maxLength={500}
          placeholder="Write the Translation"
          className="min-h-32 w-full resize-none rounded-3xl border border-[#DDE6DD] p-6 text-sm outline-none placeholder:text-[#7A867D]"
        />

        <p className="mt-3 text-xs text-[#8A968E]">
          Character count: {translation.length}/500
        </p>
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
            onClick={() => setAnswer("false")}
            className={`flex h-44 flex-col items-center justify-center rounded-3xl font-bold ${
              answer === "false"
                ? "bg-[#007A4A] text-white"
                : "bg-[#EEF3EC] text-[#526057]"
            }`}
          >
            <CircleX className="mb-4 size-10" />
            False
          </button>

          <button
            type="button"
            onClick={() => setAnswer("true")}
            className={`flex h-44 flex-col items-center justify-center rounded-3xl font-bold ${
              answer === "true"
                ? "bg-[#007A4A] text-white"
                : "bg-[#EEF3EC] text-[#526057]"
            }`}
          >
            <Check className="mb-4 size-10" />
            True
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-[#8A968E]">
          Click a card to set it as the correct answer.
        </p>
      </Card>
    </div>
  );
}
