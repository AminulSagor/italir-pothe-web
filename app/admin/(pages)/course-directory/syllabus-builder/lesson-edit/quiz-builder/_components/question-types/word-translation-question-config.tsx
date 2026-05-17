"use client";

import { useState } from "react";
import { ListPlus, Settings2 } from "lucide-react";

import Card from "@/components/UI/cards/card";

const defaultOptions = ["Ciao", "Grazie", "Buongiorno", "Prego"];

export default function WordTranslationQuestionConfig() {
  const [subtitle, setSubtitle] = useState("Translate this word");
  const [mainQuestion, setMainQuestion] = useState(
    'How do you say "Hello" in Italian?',
  );
  const [correctAnswer, setCorrectAnswer] = useState("Ciao");

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
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm font-semibold text-[#202420] outline-none"
          />
        </label>

        <label>
          <span className="mb-2 block text-[10px] font-bold uppercase text-[#66736B]">
            Main Question Text
          </span>

          <input
            value={mainQuestion}
            onChange={(event) => setMainQuestion(event.target.value)}
            className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm text-[#202420] outline-none"
          />
        </label>

        <div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-bold uppercase text-[#66736B]">
              Answer Options (Decoys & Correct Answer)
            </p>

            <button
              type="button"
              className="w-fit text-sm font-semibold text-[#007A4A]"
            >
              + Add Option
            </button>
          </div>

          <div className="space-y-3">
            {defaultOptions.map((option) => {
              const isCorrect = option === correctAnswer;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCorrectAnswer(option)}
                  className={`flex h-14 w-full items-center justify-between rounded-full border px-5 text-sm font-semibold transition ${
                    isCorrect
                      ? "border-[#62F25A] bg-[#EFFFF0] text-[#202420]"
                      : "border-transparent bg-[#EEF3EC] text-[#202420]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full border-2 ${
                        isCorrect
                          ? "border-[#62F25A] bg-[#62F25A]"
                          : "border-[#BFCBC3] bg-transparent"
                      }`}
                    >
                      {isCorrect && (
                        <span className="size-3 rounded-full bg-[#007A4A]" />
                      )}
                    </span>

                    {option}
                  </span>

                  {isCorrect ? (
                    <Settings2 className="size-5 text-[#007A4A]" />
                  ) : (
                    <span className="text-[#66736B]">🗑</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
