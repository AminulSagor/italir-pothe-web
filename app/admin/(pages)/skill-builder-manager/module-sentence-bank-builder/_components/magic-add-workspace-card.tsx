"use client";

import { Sparkles, Mic, WandSparkles } from "lucide-react";

import Card from "@/components/UI/cards/card";
import Button from "@/components/UI/buttons/button";

import AudioWavePlayer from "./audio-wave-player";

export default function MagicAddWorkspaceCard() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#E9F7E8]">
          <Sparkles className="size-5 text-[#22A447]" />
        </div>

        <h2 className="text-lg font-semibold text-[#006B3F]">
          Magic Add Workspace
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-7 xl:grid-cols-[1fr_320px]">
        <div>
          <label className="mb-3 block text-sm font-medium uppercase text-[#5F675F]">
            Source Italian Sentence
          </label>

          <div className="relative">
            <textarea
              rows={4}
              placeholder="e.g., Vorrei ordinare un caffè macchiato con latte di avena..."
              className="min-h-[150px] w-full resize-none rounded-[36px] border border-transparent bg-[#EEF2ED] p-6 pr-14 text-sm text-[#202420] outline-none placeholder:text-[#A3AAA3] focus:border-[#006B3F]"
            />

            <span className="absolute bottom-5 right-5 text-xs text-[#A0A7A0]">
              0/150
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

          <p className="mb-6 text-[28px] font-medium leading-[42px] text-[#202420]">
            আমি একটি ওট মিল্ক সহ ক্যাফে ম্যাকিয়াটো অর্ডার করতে চাই।
          </p>

          <AudioWavePlayer />

          <Button size="lg" className="mt-5 h-14 w-full gap-2">
            <WandSparkles className="size-5" />
            Confirm & Add to Bank
          </Button>
        </div>
      </div>
    </Card>
  );
}
