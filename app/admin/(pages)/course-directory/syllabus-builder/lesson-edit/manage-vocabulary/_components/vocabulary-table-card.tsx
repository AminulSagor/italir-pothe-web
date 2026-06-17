import { Pencil, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { LessonVocabulary } from "@/types/course-directory/lesson.type";

import VocabularyAudioPill from "./vocabulary-audio-pill";

interface VocabularyTableCardProps {
  words: LessonVocabulary[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (word: LessonVocabulary) => void;
  onDelete: (word: LessonVocabulary) => void;
}

export default function VocabularyTableCard({
  words,
  page,
  limit,
  totalItems,
  totalPages,
  isLoading,
  onPageChange,
  onEdit,
  onDelete,
}: VocabularyTableCardProps) {
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

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
        {isLoading ? (
          <div className="px-6 py-10 text-center text-sm text-[#66736B]">
            Loading vocabulary...
          </div>
        ) : words.length > 0 ? (
          words.map((word) => (
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

                <VocabularyAudioPill
                  duration={word.aiPronunciationFileId ? "Ready" : "No audio"}
                />
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

                <p className="text-sm text-[#526057]">
                  {word.englishExample || "No example"}
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => onEdit(word)}
                  className="text-[#66736B] hover:text-[#007A4A]"
                >
                  <Pencil className="size-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(word)}
                  className="text-[#66736B] hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-10 text-center text-sm text-[#66736B]">
            No vocabulary found.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-sm text-[#526057]">
        <p>
          Showing{" "}
          <span className="font-semibold text-[#007A4A]">
            {startItem}-{endItem}
          </span>{" "}
          of <span className="font-semibold text-[#007A4A]">{totalItems}</span>{" "}
          words
        </p>

        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={!canGoPrevious}
            onClick={() => onPageChange(page - 1)}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹ Prev
          </button>

          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full bg-[#007A4A] font-bold text-white"
          >
            {page}
          </button>

          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => onPageChange(page + 1)}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next ›
          </button>
        </div>
      </div>
    </Card>
  );
}
