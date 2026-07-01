import {
  BadgeEuro,
  CheckCircle2,
  Clock3,
  Settings,
  ShieldAlert,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { StoreAdminOrder } from "@/types/package-store/package-store.type";

interface PaymentSummaryCardProps {
  order: StoreAdminOrder;
}

const formatLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function PaymentSummaryCard({ order }: PaymentSummaryCardProps) {
  const verificationStatus = order.verification.status;

  const VerificationIcon =
    verificationStatus === "verified"
      ? CheckCircle2
      : verificationStatus === "failed"
        ? ShieldAlert
        : Clock3;

  const verificationClasses =
    verificationStatus === "verified"
      ? "bg-[#DDF3E8] text-[#006B3F]"
      : verificationStatus === "failed"
        ? "bg-[#FCEBEC] text-[#B42318]"
        : "bg-[#FFF3C6] text-[#B77900]";

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
          value={`€${order.pricing.packagePriceEur}`}
        />

        <SummaryRow
          label={`Discount (${order.pricing.discountPercentage}%)`}
          value={`-€${order.pricing.discountAmountEur}`}
        />

        <div className="border-t border-[#E7EEE8] pt-6">
          <SummaryRow
            label="Total Amount Paid"
            value={order.pricing.formattedPaymentAmount}
            large
          />
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-[#EEF3EC] px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#202420]">Payment Method</p>

            <p className="text-sm text-[#4F5B52]">
              {formatLabel(order.payment.provider)}
            </p>
          </div>

          <Settings className="size-5 text-[#006B3F]" />
        </div>

        <div className="mt-5 border-t border-[#D8E1D9] pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#202420]">
                Verification Status
              </p>

              <p className="mt-1 text-xs text-[#6F776F]">
                {formatLabel(order.verification.environment)} environment
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${verificationClasses}`}
            >
              <VerificationIcon className="size-3.5" />

              {formatLabel(verificationStatus)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4 rounded-3xl border border-[#E7EEE8] p-6">
        <DetailRow
          label="Provider Transaction ID"
          value={order.verification.providerTransactionId || "—"}
        />

        <DetailRow
          label="Provider Reference"
          value={order.payment.providerReference || "—"}
        />

        <DetailRow
          label="Verified At"
          value={formatDateTime(order.verification.verifiedAt)}
        />

        <DetailRow
          label="Paid At"
          value={formatDateTime(order.payment.paidAt)}
        />
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <p className="text-xs font-bold uppercase text-[#8A948C]">{label}</p>

      <p className="break-all text-sm text-[#202420] sm:max-w-[65%] sm:text-right">
        {value}
      </p>
    </div>
  );
}
