import { ChevronLeft, ChevronRight } from "lucide-react";

import type { SkillBuilderSentenceListResponse } from "@/types/skill-builder/skill-builder.type";

interface SentenceBankPaginationProps {
  sentenceList: SkillBuilderSentenceListResponse;
  onPageChange: (page: number) => void;
}

export default function SentenceBankPagination({
  sentenceList,
  onPageChange,
}: SentenceBankPaginationProps) {
  const startItem =
    sentenceList.totalItems === 0
      ? 0
      : (sentenceList.page - 1) * sentenceList.limit + 1;

  const endItem = Math.min(
    sentenceList.page * sentenceList.limit,
    sentenceList.totalItems,
  );

  const canGoPrevious = sentenceList.page > 1;
  const canGoNext = sentenceList.page < sentenceList.totalPages;

  const pages = Array.from({ length: sentenceList.totalPages }).map(
    (_, index) => index + 1,
  );

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-[#66736B]">
        Showing{" "}
        <span className="text-[#006B3F]">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="text-[#006B3F]">{sentenceList.totalItems}</span>{" "}
        sentences
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(sentenceList.page - 1)}
          className="flex size-11 items-center justify-center rounded-full border border-[#DCE5DA] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="size-5" />
        </button>

        {pages.map((page) => {
          if (
            sentenceList.totalPages > 5 &&
            page !== 1 &&
            page !== sentenceList.totalPages &&
            Math.abs(page - sentenceList.page) > 1
          ) {
            if (page === 2 || page === sentenceList.totalPages - 1) {
              return (
                <span key={page} className="px-2 text-[#66736B]">
                  ...
                </span>
              );
            }

            return null;
          }

          const isActive = page === sentenceList.page;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`flex size-11 items-center justify-center rounded-full ${
                isActive ? "bg-[#006B3F] text-white" : "text-[#66736B]"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(sentenceList.page + 1)}
          className="flex size-11 items-center justify-center rounded-full border border-[#DCE5DA] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
