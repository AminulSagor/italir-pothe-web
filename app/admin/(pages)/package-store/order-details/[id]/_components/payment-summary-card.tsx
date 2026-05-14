import { BadgeEuro, Settings } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { orderDetailsMock } from "@/mock/package-store/order-details.mock";

export default function PaymentSummaryCard() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#FFF0D6] text-[#FF7A00]">
          <BadgeEuro className="size-5" />
        </div>

        <h2 className="text-lg font-semibold text-[#202420]">
          Payment Summary
        </h2>
      </div>

      <div className="space-y-6">
        <SummaryRow
          label="Subtotal"
          value={orderDetailsMock.payment.subtotal}
        />
        <SummaryRow
          label="VAT / Tax (22%)"
          value={orderDetailsMock.payment.tax}
        />

        <div className="border-t border-[#E7EEE8] pt-6">
          <SummaryRow
            label="Total Amount Paid"
            value={orderDetailsMock.payment.total}
            large
          />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between rounded-3xl bg-[#EEF3EC] px-6 py-5">
        <div>
          <p className="text-xs font-bold text-[#202420]">Payment Method</p>
          <p className="text-sm text-[#4F5B52]">
            {orderDetailsMock.payment.method}
          </p>
        </div>

        <Settings className="size-5 text-[#006B3F]" />
      </div>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
  large,
}: {
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p
        className={
          large ? "text-xl font-bold text-[#202420]" : "text-sm text-[#4F5B52]"
        }
      >
        {label}
      </p>

      <p
        className={
          large ? "text-xl font-bold text-[#006B3F]" : "text-sm text-[#202420]"
        }
      >
        {value}
      </p>
    </div>
  );
}
