"use client";

import { Mic, Sparkles, WandSparkles } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

import AudioWavePlayer from "./audio-wave-player";
import type { SkillBuilderSentence } from "@/types/skill-builder/skill-builder.type";

interface MagicAddWorkspaceCardProps {
  italianSentence: string;
  bengaliTranslation: string;
  selectedSentence: SkillBuilderSentence | null;
  isSaving?: boolean;
  onItalianSentenceChange: (value: string) => void;
  onBengaliTranslationChange: (value: string) => void;
  onConfirm: () => void;
  onCancelEdit: () => void;
}

export default function MagicAddWorkspaceCard({
  italianSentence,
  bengaliTranslation,
  selectedSentence,
  isSaving = false,
  onItalianSentenceChange,
  onBengaliTranslationChange,
  onConfirm,
  onCancelEdit,
}: MagicAddWorkspaceCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#E9F7E8]">
            <Sparkles className="size-5 text-[#22A447]" />
          </div>

          <h2 className="text-lg font-semibold text-[#006B3F]">
            Magic Add Workspace
          </h2>
        </div>

        {selectedSentence ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm font-medium text-[#D92D20]"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_320px]">
        <div>
          <label className="mb-3 block text-sm font-medium uppercase text-[#5F675F]">
            Source Italian Sentence
          </label>

          <div className="relative">
            <textarea
              rows={4}
              value={italianSentence}
              maxLength={150}
              placeholder="e.g., Vorrei ordinare un caffè macchiato con latte di avena..."
              onChange={(event) => onItalianSentenceChange(event.target.value)}
              className="min-h-[150px] w-full resize-none rounded-[36px] border border-transparent bg-[#EEF2ED] p-6 pr-14 text-sm text-[#202420] outline-none placeholder:text-[#A3AAA3] focus:border-[#006B3F]"
            />

            <span className="absolute bottom-5 right-5 text-xs text-[#A0A7A0]">
              {italianSentence.length}/150
            </span>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="mt-6 h-20 rounded-full border-[#4BEB53] px-8 text-[#006B3F]"
          >
            <Mic className="mr-2 size-5" />
            Generate AI Voice
          </Button>
        </div>

        <div className="rounded-[36px] border border-[#E7ECE6] bg-white p-5">
          <h3 className="mb-4 text-sm font-medium text-[#5F675F]">
            Write Bengali Translation
          </h3>

          <textarea
            value={bengaliTranslation}
            rows={4}
            placeholder="বাংলা অনুবাদ লিখুন..."
            onChange={(event) => onBengaliTranslationChange(event.target.value)}
            className="mb-6 w-full resize-none rounded-3xl bg-[#F7FAF6] p-4 text-xl font-medium leading-9 text-[#202420] outline-none placeholder:text-[#A3AAA3]"
          />

          <AudioWavePlayer />

          <Button
            size="lg"
            disabled={isSaving || !italianSentence.trim()}
            className="mt-5 h-14 w-full gap-2"
            onClick={onConfirm}
          >
            <WandSparkles className="size-5" />
            {isSaving
              ? "Saving..."
              : selectedSentence
                ? "Update Sentence"
                : "Confirm & Add to Bank"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
