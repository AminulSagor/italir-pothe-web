"use client";

import type {
  SkillBuilderSentence,
  SkillBuilderSentenceListResponse,
  SkillBuilderSortOrder,
} from "@/types/skill-builder/skill-builder.type";

import SentenceBankItem from "./sentence-bank-item";
import SentenceBankPagination from "./sentence-bank-pagination";
import SentenceBankToolbar from "./sentence-bank-toolbar";
import SentenceStatsCards from "./sentence-stats-cards";

interface SentenceBankSectionProps {
  sentenceList: SkillBuilderSentenceListResponse;
  isLoading?: boolean;
  searchValue: string;
  syncLabel: string;
  sortOrder: SkillBuilderSortOrder;
  onSearchChange: (value: string) => void;
  onSortToggle: () => void;
  onPageChange: (page: number) => void;
  onEditSentence: (sentence: SkillBuilderSentence) => void;
  onDeleteSentence: (sentence: SkillBuilderSentence) => void;
}

export default function SentenceBankSection({
  sentenceList,
  isLoading = false,
  searchValue,
  syncLabel,
  sortOrder,
  onSearchChange,
  onSortToggle,
  onPageChange,
  onEditSentence,
  onDeleteSentence,
}: SentenceBankSectionProps) {
  return (
    <section className="space-y-7">
      <SentenceBankToolbar
        totalSentences={sentenceList.totalItems}
        searchValue={searchValue}
        sortOrder={sortOrder}
        onSearchChange={onSearchChange}
        onSortToggle={onSortToggle}
      />

      <div className="space-y-5">
        {isLoading ? (
          <div className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-[#5F675F]">
            Loading sentences...
          </div>
        ) : sentenceList.items.length > 0 ? (
          sentenceList.items.map((sentence, index) => (
            <SentenceBankItem
              key={sentence.id}
              item={sentence}
              index={(sentenceList.page - 1) * sentenceList.limit + index}
              onEdit={() => onEditSentence(sentence)}
              onDelete={() => onDeleteSentence(sentence)}
            />
          ))
        ) : (
          <div className="rounded-3xl bg-white px-6 py-10 text-center text-sm text-[#5F675F]">
            No sentences found.
          </div>
        )}
      </div>

      <SentenceBankPagination
        sentenceList={sentenceList}
        onPageChange={onPageChange}
      />

      <SentenceStatsCards
        totalSentences={sentenceList.totalItems}
        syncLabel={syncLabel}
      />
    </section>
  );
}
