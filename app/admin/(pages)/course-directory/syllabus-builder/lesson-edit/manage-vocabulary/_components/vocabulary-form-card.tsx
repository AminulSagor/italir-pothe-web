import { Save, Sparkles } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

interface VocabularyFormState {
  italianWord: string;
  aiPronunciationFileId: string;
  englishMeaning: string;
  englishExample: string;
  sortOrder: number;
}

interface VocabularyFormCardProps {
  form: VocabularyFormState;
  isEditing: boolean;
  isSaving: boolean;
  onChange: <K extends keyof VocabularyFormState>(
    key: K,
    value: VocabularyFormState[K],
  ) => void;
  onSave: () => void;
  onDiscard: () => void;
}

function VocabularyInput({
  label,
  placeholder,
  value,
  className = "",
  rightIcon = false,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  className?: string;
  rightIcon?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-[#526057]">
        {label}
      </span>

      <div className="flex h-12 items-center rounded-full bg-[#E9EFE7] px-5">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-[#202420] outline-none placeholder:text-[#8B9690]"
        />

        {rightIcon && <Sparkles className="size-4 shrink-0 text-[#007A4A]" />}
      </div>
    </label>
  );
}

export default function VocabularyFormCard({
  form,
  isEditing,
  isSaving,
  onChange,
  onSave,
  onDiscard,
}: VocabularyFormCardProps) {
  return (
    <Card
      padding="lg"
      rounded="3xl"
      shadow="sm"
      className="border border-[#E2E8E1]"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <VocabularyInput
          label="Italian Word"
          value={form.italianWord}
          placeholder="e.g Buongiorno"
          onChange={(value) => onChange("italianWord", value)}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#526057]">
            AI Pronunciation
          </span>

          <button
            type="button"
            disabled
            className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-[#E1E8DF] text-sm font-medium text-[#007A4A] opacity-70"
          >
            <Sparkles className="size-4" />
            Generate Audio
          </button>
        </label>

        <VocabularyInput
          label="English Meaning"
          value={form.englishMeaning}
          placeholder="e.g. Good morning"
          rightIcon
          onChange={(value) => onChange("englishMeaning", value)}
        />

        <VocabularyInput
          label="English Example"
          value={form.englishExample}
          placeholder="e.g. The boy is playing"
          className="lg:col-span-2"
          onChange={(value) => onChange("englishExample", value)}
        />

        <div className="flex items-end gap-3">
          {isEditing ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isSaving}
              onClick={onDiscard}
            >
              Discard
            </Button>
          ) : null}

          <Button
            type="button"
            size="lg"
            disabled={isSaving}
            onClick={onSave}
            className="w-full gap-2 bg-[#58F24F] text-[#007A4A] hover:bg-[#4BEA44]"
          >
            <Save className="size-4" />
            {isSaving ? "Saving..." : isEditing ? "Update Word" : "Save Word"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
