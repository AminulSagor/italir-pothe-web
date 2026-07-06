import {
  BadgeEuro,
  CheckCircle2,
  Clock3,
  RotateCcw,
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
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const getTokenHash = (order: StoreAdminOrder) =>
  order.verification.purchaseTokenHash || order.verification.tokenHash || "—";

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
          Provider Transaction
        </h2>
      </div>

      <div className="space-y-6">
        <SummaryRow
          label="Package Price"
          value={`€${order.pricing.packagePriceEur}`}
        />

        <SummaryRow
          label={`Discount (${order.pricing.discountPercentage}%)`}
          value={`-€${order.pricing.discountAmountEur}`}
        />

        <SummaryRow
          label="Coupon Code"
          value={order.pricing.couponCode || "—"}
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

        <DetailRow label="Purchase Token Hash" value={getTokenHash(order)} />

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

        <DetailRow
          label="Refunded At"
          value={formatDateTime(order.payment.refundedAt)}
        />
      </div>

      <div className="mt-8 rounded-3xl border border-[#F4D5D2] bg-[#FFF7F6] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#FCEBEC] text-[#B42318]">
            <RotateCcw className="size-5" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#202420]">
              Refund / Reversal Info
            </h3>

            <p className="text-xs text-[#7A847B]">
              Entitlement reversal is handled by backend only.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SmallDetail
            label="Refund Status"
            value={order.payment.refundedAt ? "Refunded" : "Not refunded"}
          />

          <SmallDetail
            label="Refund Reason"
            value={order.payment.refundReason || "—"}
          />

          <SmallDetail
            label="Reversed Voice Minutes"
            value={String(order.reversal.voiceMinutes)}
          />

          <SmallDetail
            label="Reversed Text Tokens"
            value={String(order.reversal.textTokens)}
          />

          <SmallDetail
            label="Reversed Streak Freezes"
            value={String(order.reversal.freezeCount)}
          />

          <SmallDetail
            label="Reversed CV Credits"
            value={String(order.reversal.cvCredits)}
          />

          <SmallDetail
            label="Protection Granted Until"
            value={formatDateTime(
              order.reversal.unlimitedProtectionGrantedUntil,
            )}
          />
        </div>
      </div>

      {order.subscription && (
        <div className="mt-8 rounded-3xl border border-[#DDE5DE] bg-[#F7FAF7] p-6">
          <h3 className="text-base font-bold text-[#202420]">
            Subscription Lifecycle
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallDetail
              label="Subscription Status"
              value={order.subscription.status || "—"}
            />

            <SmallDetail
              label="Entitlement Active"
              value={
                order.subscription.entitlementActive === null ||
                order.subscription.entitlementActive === undefined
                  ? "—"
                  : order.subscription.entitlementActive
                    ? "Yes"
                    : "No"
              }
            />

            <SmallDetail
              label="Auto-renew Enabled"
              value={
                order.subscription.autoRenewEnabled === null ||
                order.subscription.autoRenewEnabled === undefined
                  ? "—"
                  : order.subscription.autoRenewEnabled
                    ? "Yes"
                    : "No"
              }
            />

            <SmallDetail
              label="Started At"
              value={formatDateTime(order.subscription.startedAt)}
            />

            <SmallDetail
              label="Expires At"
              value={formatDateTime(order.subscription.expiresAt)}
            />

            <SmallDetail
              label="Canceled At"
              value={formatDateTime(order.subscription.canceledAt)}
            />

            <SmallDetail
              label="Revoked At"
              value={formatDateTime(order.subscription.revokedAt)}
            />

            <SmallDetail
              label="Last Synced At"
              value={formatDateTime(order.subscription.lastSyncedAt)}
            />

            <SmallDetail
              label="Environment"
              value={
                order.subscription.environment
                  ? formatLabel(order.subscription.environment)
                  : "—"
              }
            />
          </div>
        </div>
      )}
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

function SmallDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <p className="text-[10px] font-bold uppercase text-[#8A948C]">{label}</p>

      <p className="mt-1 break-all text-sm font-semibold text-[#202420]">
        {value}
      </p>
    </div>
  );
}
