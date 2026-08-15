"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type CVTemplatePaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export default function CVTemplatePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: CVTemplatePaginationProps) {
  if (total <= 0) return null;

  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const start = (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, total);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === safePage) return;
    onPageChange(nextPage);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-black/50">
        Showing <span className="font-semibold text-[#202420]">{start}</span>–
        <span className="font-semibold text-[#202420]">{end}</span> of{" "}
        <span className="font-semibold text-[#202420]">{total}</span> templates
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(safePage - 1)}
          disabled={safePage <= 1}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-black/10 px-3 text-sm font-medium text-[#202420] transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          Previous
        </button>

        <span className="min-w-[92px] text-center text-sm font-medium text-black/60">
          Page {safePage} of {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          onClick={() => goToPage(safePage + 1)}
          disabled={safePage >= totalPages}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-black/10 px-3 text-sm font-medium text-[#202420] transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
