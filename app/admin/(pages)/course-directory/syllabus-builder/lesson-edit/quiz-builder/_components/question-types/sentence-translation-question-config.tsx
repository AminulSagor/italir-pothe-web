"use client";

import { useState } from "react";
import { Puzzle } from "lucide-react";

import Card from "@/components/UI/cards/card";

const previewWords = ["Io", "vorrei", "un", "caffè."];
const defaultDecoyWords = ["Grazie", "per", "favore"];

export default function SentenceTranslationQuestionConfig() {
  const [sentence, setSentence] = useState("Io vorrei un caffè.");
  const [decoyWords, setDecoyWords] = useState(defaultDecoyWords);
  const [decoyInput, setDecoyInput] = useState("");

  const handleAddDecoyWord = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !decoyInput.trim()) return;

    event.preventDefault();
    setDecoyWords((prev) => [...prev, decoyInput.trim()]);
    setDecoyInput("");
  };

  const handleRemoveDecoyWord = (word: string) => {
    setDecoyWords((prev) => prev.filter((item) => item !== word));
  };

  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="mb-7 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#DDF3E8]">
          <Puzzle className="size-5 text-[#007A4A]" />
        </div>

        <h3 className="text-xl font-bold text-[#202420]">
          Transcription Assembly
        </h3>
      </div>

      <div className="space-y-7">
        <label>
          <span className="mb-3 block text-[10px] font-bold uppercase text-[#8A968E]">
            Sentence to Assemble
          </span>

          <div className="rounded-full bg-[#EEF3EC] px-6 py-4">
            <input
              value={sentence}
              onChange={(event) => setSentence(event.target.value)}
              placeholder="Audio Text will be placed here and turned into pills"
              className="mb-1 w-full bg-transparent text-xs text-[#8A968E] outline-none placeholder:text-[#8A968E]"
            />

            <p className="text-base font-semibold text-[#007A4A]">{sentence}</p>
          </div>
        </label>

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase text-[#8A968E]">
            App Preview (Pills)
          </p>

          <div className="flex flex-wrap justify-center gap-3 rounded-full bg-[#EEF3EC] px-5 py-6">
            {previewWords.map((word) => (
              <span
                key={word}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#202420] shadow-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-[10px] font-bold uppercase text-[#8A968E]">
            Add Decoy Words
          </p>

          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E2E8E1] bg-white px-4 py-3">
            {decoyWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => handleRemoveDecoyWord(word)}
                className="rounded-full bg-[#EEF3EC] px-4 py-2 text-xs font-semibold text-[#526057]"
              >
                {word} ×
              </button>
            ))}

            <input
              value={decoyInput}
              onChange={(event) => setDecoyInput(event.target.value)}
              onKeyDown={handleAddDecoyWord}
              placeholder="Type and press enter to add..."
              className="min-w-[180px] flex-1 bg-transparent text-sm outline-none placeholder:text-[#8A968E]"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
