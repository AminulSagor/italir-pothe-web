import { CreditCard, ReceiptText } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { orderDetailsMock } from "@/mock/package-store/order-details.mock";

export default function OrderSummaryCard() {
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
                {orderDetailsMock.orderId}
              </h2>

              <span className="rounded-full bg-[#DDF3E8] px-4 py-1 text-xs font-semibold text-[#007A35]">
                {orderDetailsMock.status}
              </span>
            </div>

            <p className="text-sm text-[#4F5B52]">
              Transaction date: {orderDetailsMock.transactionDate}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#8A948C]">METHOD</p>
          <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-[#202420]">
            <CreditCard className="size-4" />
            {orderDetailsMock.method}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#8A948C]">TOTAL AMOUNT</p>
          <p className="mt-1 text-2xl font-bold text-[#006B3F]">
            {orderDetailsMock.totalAmount}
          </p>
        </div>
      </div>
    </Card>
  );
}
