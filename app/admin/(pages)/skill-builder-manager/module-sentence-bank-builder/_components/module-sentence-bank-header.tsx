"use client";

import { ArrowLeft } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface ModuleSentenceBankHeaderProps {
  isSyncing?: boolean;
  onBack: () => void;
  onSaveAndSync: () => void;
}

export default function ModuleSentenceBankHeader({
  isSyncing = false,
  onBack,
  onSaveAndSync,
}: ModuleSentenceBankHeaderProps) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onBack}
          className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <ArrowLeft className="size-5 text-[#006B3F]" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#202420] md:text-3xl">
            Module Sentence Bank Builder
          </h1>

          <p className="mt-2 text-sm text-[#66736B] md:text-base">
            Architecture module for AI assisted linguistic datasets
          </p>
        </div>
      </div>

      <Button
        size="lg"
        disabled={isSyncing}
        className="px-8 shadow-md"
        onClick={onSaveAndSync}
      >
        {isSyncing ? "Saving..." : "Save & Sync"}
      </Button>
    </div>
  );
}
