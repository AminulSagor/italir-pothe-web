import Card from "@/components/UI/cards/card";
import type {
  EvaluationQueueItem,
  EvaluationQueueResponse,
} from "@/types/evaluation-center/evaluation-center.type";

import EvaluationTableRow from "./evaluation-table-row";

interface EvaluationTableProps {
  response: EvaluationQueueResponse;

  isLoading: boolean;

  onPageChange: (page: number) => void;

  onOpenAttempt: (item: EvaluationQueueItem) => void;
}

const getVisiblePages = (page: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  const start = Math.min(Math.max(1, page - 1), totalPages - 2);

  return [start, start + 1, start + 2];
};

export default function EvaluationTable({
  response,
  isLoading,
  onPageChange,
  onOpenAttempt,
}: EvaluationTableProps) {
  const visiblePages = getVisiblePages(
    response.meta.page,
    response.meta.totalPages,
  );

  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="bg-[#F2F7F1]">
            <tr>
              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                STUDENT
              </th>

              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                LEVEL
              </th>

              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                SUBMISSION DATE
              </th>

              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                TIME IN QUEUE
              </th>

              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                STATUS
              </th>

              <th className="px-4 py-5 text-left text-xs font-bold text-[#4F5B52]">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className={isLoading ? "opacity-55" : ""}>
            {response.items.map((item) => (
              <EvaluationTableRow
                key={item.attemptId}
                item={item}
                targetWaitHours={response.stats.targetWaitHours}
                onOpen={onOpenAttempt}
              />
            ))}

            {!response.items.length && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-16 text-center text-sm text-[#7A847B]"
                >
                  No exam attempts matched the selected search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-end">
        <p className="text-sm text-[#202420]">
          Showing {response.meta.from}–{response.meta.to} of{" "}
          {response.meta.total}
        </p>

        {response.meta.totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!response.meta.hasPreviousPage || isLoading}
              onClick={() => onPageChange(response.meta.page - 1)}
              className="flex size-10 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous evaluation queue page"
            >
              ‹
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                disabled={isLoading}
                onClick={() => onPageChange(pageNumber)}
                className={`flex size-12 items-center justify-center rounded-full shadow-sm ${
                  pageNumber === response.meta.page
                    ? "bg-[#006B3F] text-white"
                    : "bg-white text-[#202420]"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={!response.meta.hasNextPage || isLoading}
              onClick={() => onPageChange(response.meta.page + 1)}
              className="flex size-10 items-center justify-center rounded-full bg-white text-[#006B3F] shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next evaluation queue page"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
