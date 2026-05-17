import { Save, Sparkles } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

function VocabularyInput({
  label,
  placeholder,
  className = "",
  rightIcon = false,
}: {
  label: string;
  placeholder: string;
  className?: string;
  rightIcon?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-[#526057]">
        {label}
      </span>

      <div className="flex h-12 items-center rounded-full bg-[#E9EFE7] px-5">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[#202420] outline-none placeholder:text-[#8B9690]"
        />

        {rightIcon && <Sparkles className="size-4 shrink-0 text-[#007A4A]" />}
      </div>
    </label>
  );
}

export default function VocabularyFormCard() {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <VocabularyInput label="Italian Word" placeholder="e.g Buongiorno" />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#526057]">
            AI Pronunciation
          </span>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E1E8DF] text-sm font-medium text-[#007A4A]"
          >
            <Sparkles className="size-4" />
            Generate Audio
          </button>
        </label>

        <VocabularyInput
          label="English Meaning"
          placeholder="e.g. Good morning"
          rightIcon
        />

        <VocabularyInput
          label="English Example"
          placeholder="e.g. The boy is playing"
          className="lg:col-span-2"
        />

        <div className="flex items-end">
          <Button
            size="lg"
            className="w-full gap-2 bg-[#58F24F] text-[#007A4A] hover:bg-[#4BEA44]"
          >
            <Save className="size-4" />
            Save Word
          </Button>
        </div>
      </div>
    </Card>
  );
}
