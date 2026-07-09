import { CreditCard, ReceiptText } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type {
  StoreAdminOrder,
  StoreOrderStatus,
} from "@/types/package-store/package-store.type";

interface OrderSummaryCardProps {
  order: StoreAdminOrder;
}

const statusClasses: Record<StoreOrderStatus, string> = {
  completed: "bg-[#DDF3E8] text-[#007A35]",
  pending: "bg-[#FFF3C6] text-[#B77900]",
  failed: "bg-[#FCEBEC] text-[#B42318]",
  cancelled: "bg-[#EEF3EC] text-[#4F5B52]",
  expired: "bg-[#F4E8FF] text-[#7A3EB1]",
  refunded: "bg-[#FCEBEC] text-[#D92D20]",
};

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

              <span
                className={`rounded-full px-4 py-1 text-xs font-semibold capitalize ${
                  statusClasses[order.status] || "bg-[#EEF3EC] text-[#4F5B52]"
                }`}
              >
                {formatLabel(order.status)}
              </span>
            </div>

            <div className="mt-2 grid gap-1 text-sm text-[#4F5B52]">
              <p>Created: {formatDate(order.createdAt)}</p>

              <p>Checkout Expires: {formatDate(order.checkoutExpiresAt)}</p>

              <p>Completed: {formatDate(order.payment.paidAt)}</p>

              <p>Cancelled: {formatDate(order.cancelledAt)}</p>

              <p>Expired: {formatDate(order.expiredAt)}</p>

              <p>Refunded: {formatDate(order.payment.refundedAt)}</p>
            </div>

            {(order.payment.failureCode || order.payment.failureMessage) && (
              <div className="mt-3 rounded-2xl bg-[#FCEBEC] px-4 py-3 text-xs text-[#B42318]">
                <p className="font-bold">
                  Failure Code: {order.payment.failureCode || "—"}
                </p>

                <p className="mt-1">
                  {order.payment.failureMessage || "No failure message."}
                </p>
              </div>
            )}
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
