"use client";

import { useState } from "react";
import { Eye, Settings } from "lucide-react";

import Card from "@/components/UI/cards/card";

const options = ["vorrei", "mangio", "sono", "vado"];

export default function FillBlanksQuestionConfig() {
  const [sentence, setSentence] = useState("Io [vorrei] un caffè.");
  const [correctAnswer, setCorrectAnswer] = useState("vorrei");

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
          Question 3 Configuration
        </h3>
      </div>

      <label>
        <span className="mb-2 block text-[10px] font-bold uppercase text-[#8A968E]">
          Sentence Builder
        </span>

        <textarea
          value={sentence}
          onChange={(event) => setSentence(event.target.value)}
          className="min-h-36 w-full resize-none rounded-3xl border border-[#DDF3E8] bg-white p-6 text-lg outline-none"
        />
      </label>

      <div className="my-7 rounded-3xl bg-[#EEF3EC] p-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase text-[#007A4A]">
          <Eye className="size-4" />
          Live App Preview
        </div>

        <div className="rounded-full bg-white px-8 py-6 text-center text-xl">
          Io{" "}
          <span className="mx-4 inline-block min-w-20 border-b-4 border-[#9FC8B5] tracking-[8px] text-[#9FC8B5]">
            .....
          </span>{" "}
          un caffè.
        </div>
      </div>

      <p className="mb-4 text-[10px] font-bold uppercase text-[#8A968E]">
        Answer Options & Correct Key
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option, index) => {
          const isCorrect = option === correctAnswer;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setCorrectAnswer(option)}
              className={`flex h-14 items-center justify-between rounded-full border px-5 text-sm font-bold ${
                isCorrect
                  ? "border-[#007A4A] bg-[#E9FFF0] text-[#007A4A]"
                  : "border-transparent bg-[#EEF3EC] text-[#202420]"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="size-5 rounded-full border border-[#BFCBC3] bg-white" />
                {option}
              </span>

              {isCorrect && (
                <span className="text-[10px] uppercase">Correct</span>
              )}
              {!isCorrect && (
                <span className="text-[10px] text-[#8A968E]">
                  Decoy Option {index}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
