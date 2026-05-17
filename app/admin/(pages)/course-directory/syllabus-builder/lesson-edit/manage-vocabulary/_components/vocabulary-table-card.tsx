import { Pencil, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { VocabularyWordMock } from "@/mock/manage-vocabulary/manage-vocabulary.types";

import VocabularyAudioPill from "./vocabulary-audio-pill";

interface VocabularyTableCardProps {
  words: VocabularyWordMock[];
}

export default function VocabularyTableCard({
  words,
}: VocabularyTableCardProps) {
  return (
    <Card
      padding="none"
      rounded="3xl"
      shadow="sm"
      className="overflow-hidden border border-[#E2E8E1]"
    >
      <div className="hidden grid-cols-[1fr_1.3fr_1fr_1.8fr_100px] border-b border-[#E2E8E1] px-6 py-6 text-xs font-bold uppercase text-[#66736B] md:grid">
        <span>Italian Word</span>
        <span>Pronunciation</span>
        <span>English Meaning</span>
        <span>English Example</span>
        <span className="text-right">Actions</span>
      </div>

      <div>
        {words.map((word) => (
          <div
            key={word.id}
            className="grid gap-4 border-b border-[#E2E8E1] px-5 py-5 last:border-b-0 md:grid-cols-[1fr_1.3fr_1fr_1.8fr_100px] md:items-center md:px-6"
          >
            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#66736B] md:hidden">
                Italian Word
              </p>
              <p className="text-sm font-medium text-[#007A4A]">
                {word.italianWord}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#66736B] md:hidden">
                Pronunciation
              </p>
              <VocabularyAudioPill duration={word.pronunciationDuration} />
            </div>

            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#66736B] md:hidden">
                English Meaning
              </p>
              <p className="text-sm text-[#202420]">{word.englishMeaning}</p>
            </div>

            <div>
              <p className="mb-1 text-xs font-bold uppercase text-[#66736B] md:hidden">
                English Example
              </p>
              <p className="text-sm text-[#526057]">{word.englishExample}</p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="text-[#66736B] hover:text-[#007A4A]"
              >
                <Pencil className="size-4" />
              </button>

              <button
                type="button"
                className="text-[#66736B] hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4 px-6 py-5 text-sm text-[#526057]">
        <button type="button">‹ Prev</button>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full bg-[#007A4A] font-bold text-white"
        >
          1
        </button>
        <button type="button">2</button>
        <button type="button">3</button>
        <button type="button">Next ›</button>
      </div>
    </Card>
  );
}
