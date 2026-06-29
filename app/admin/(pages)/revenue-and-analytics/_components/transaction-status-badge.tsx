import type { RevenueTransactionStatus } from "@/types/revenue-and-analytics/revenue-and-analytics.type";

interface TransactionStatusBadgeProps {
  status: Exclude<RevenueTransactionStatus, "all">;
}

export default function TransactionStatusBadge({
  status,
}: TransactionStatusBadgeProps) {
  const isRefunded = status === "refunded";

  return (
    <div
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        isRefunded
          ? "bg-[#FCEBEC] text-[#B42318]"
          : "bg-[#EAF6EF] text-[#0B8A4D]"
      }`}
    >
      {status}
    </div>
  );
}
