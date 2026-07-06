import { CreditCard, ReceiptText } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { StoreAdminOrder } from "@/types/package-store/package-store.type";

interface OrderSummaryCardProps {
  order: StoreAdminOrder;
}

const formatDate = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="grid gap-6 md:grid-cols-[1.5fr_1fr_1fr] md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#DDF3E8] text-[#006B3F]">
            <ReceiptText className="size-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-[#202420]">
                {order.orderNumber}
              </h2>

              <span className="rounded-full bg-[#DDF3E8] px-4 py-1 text-xs font-semibold capitalize text-[#007A35]">
                {formatLabel(order.status)}
              </span>
            </div>

            <p className="text-sm text-[#4F5B52]">
              Created: {formatDate(order.createdAt)}
            </p>

            <p className="text-sm text-[#4F5B52]">
              Completed: {formatDate(order.payment.paidAt)}
            </p>

            <p className="text-sm text-[#4F5B52]">
              Refunded: {formatDate(order.payment.refundedAt)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#8A948C]">METHOD</p>

          <p className="mt-1 flex items-center gap-2 text-lg font-semibold capitalize text-[#202420]">
            <CreditCard className="size-4" />
            {formatLabel(order.payment.provider)}
          </p>

          <p className="mt-1 text-xs text-[#8A948C]">
            Environment: {formatLabel(order.verification.environment)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#8A948C]">TOTAL AMOUNT</p>

          <p className="mt-1 text-2xl font-bold text-[#006B3F]">
            {order.pricing.formattedPaymentAmount}
          </p>

          <p className="mt-1 text-xs text-[#8A948C]">
            EUR total: €{order.pricing.totalAmountEur}
          </p>
        </div>
      </div>
    </Card>
  );
}
