import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface StorePaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function StorePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: StorePaginationProps) {
  if (totalPages <= 1 && total <= limit) return null;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const visibleStart = Math.min(
    Math.max(1, page - 1),
    Math.max(1, totalPages - 2),
  );
  const visiblePages = Array.from(
    { length: Math.min(3, totalPages) },
    (_, index) => visibleStart + index,
  );

  return (
    <div className="flex flex-col gap-4 border-t border-[#EEF2EE] px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[#4F5B52]">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`size-9 rounded-full text-sm font-semibold ${
              pageNumber === page ? "bg-[#006B3F] text-white" : "text-[#4F5B52]"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        {visiblePages.at(-1) !== totalPages && totalPages > 3 && (
          <MoreHorizontal className="size-4 text-[#8A948C]" />
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
