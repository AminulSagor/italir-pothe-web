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

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord => {
  return typeof value === "object" && value !== null;
};

const getRecord = (source: unknown, key: string): UnknownRecord | null => {
  if (!isRecord(source)) return null;

  const value = source[key];

  return isRecord(value) ? value : null;
};

const getString = (source: unknown, key: string) => {
  if (!isRecord(source)) return "";

  const value = source[key];

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

const getNumber = (value: unknown) => {
  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
};

const formatLabel = (value?: string | null) => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatMoney = (value: unknown) => {
  return `€${getNumber(value).toFixed(2)}`;
};

export default function PaymentSummaryCard({ order }: PaymentSummaryCardProps) {
  const orderRecord = order as unknown as UnknownRecord;

  const pricing = getRecord(orderRecord, "pricing");
  const payment = getRecord(orderRecord, "payment");
  const reversal = getRecord(orderRecord, "reversal");
  const subscription = getRecord(orderRecord, "subscription");

  const providerSnapshot =
    getRecord(orderRecord, "providerSnapshot") ||
    getRecord(orderRecord, "storeProduct");

  const providerTransaction =
    getRecord(orderRecord, "providerTransaction") ||
    getRecord(orderRecord, "verification");

  const refundOperation = getRecord(orderRecord, "refundOperation");

  const provider =
    getString(payment, "provider") ||
    getString(providerSnapshot, "provider") ||
    getString(providerTransaction, "provider");

  const verificationStatus =
    getString(providerTransaction, "verificationStatus") ||
    getString(providerTransaction, "status") ||
    "pending";

  const VerificationIcon =
    verificationStatus === "verified" || verificationStatus === "completed"
      ? CheckCircle2
      : verificationStatus === "failed"
        ? ShieldAlert
        : Clock3;

  const verificationClasses =
    verificationStatus === "verified" || verificationStatus === "completed"
      ? "bg-[#DDF3E8] text-[#006B3F]"
      : verificationStatus === "failed"
        ? "bg-[#FCEBEC] text-[#B42318]"
        : "bg-[#FFF3C6] text-[#B77900]";

  const environment =
    getString(providerTransaction, "environment") ||
    getString(providerTransaction, "environment");

  const providerTransactionId = getString(
    providerTransaction,
    "providerTransactionId",
  );

  const tokenHash =
    getString(providerTransaction, "tokenHash") ||
    getString(providerTransaction, "purchaseTokenHash");

  const paidAt =
    getString(payment, "paidAt") || getString(orderRecord, "paidAt");

  const refundedAt =
    getString(payment, "refundedAt") || getString(orderRecord, "refundedAt");

  const verifiedAt = getString(providerTransaction, "verifiedAt");

  const refundStatus =
    getString(refundOperation, "status") ||
    (refundedAt ? "refunded" : "not_refunded");

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
          value={
            getString(pricing, "packagePriceEur")
              ? formatMoney(getString(pricing, "packagePriceEur"))
              : "—"
          }
        />

        <SummaryRow
          label={`Discount (${getString(pricing, "discountPercentage") || 0}%)`}
          value={
            getString(pricing, "discountAmountEur")
              ? `-${formatMoney(getString(pricing, "discountAmountEur"))}`
              : "—"
          }
        />

        <SummaryRow
          label="Coupon Code"
          value={getString(pricing, "couponCode") || "—"}
        />

        <div className="border-t border-[#E7EEE8] pt-6">
          <SummaryRow
            label="Total Amount Paid"
            value={
              getString(pricing, "formattedPaymentAmount") ||
              formatMoney(getString(pricing, "totalAmountEur"))
            }
            large
          />
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-[#EEF3EC] px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#202420]">Payment Method</p>

            <p className="text-sm text-[#4F5B52]">{formatLabel(provider)}</p>
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
                {formatLabel(environment)} environment
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
        <DetailRow label="Provider" value={formatLabel(provider)} />

        <DetailRow
          label="Product ID"
          value={
            getString(providerSnapshot, "productId") ||
            getString(providerSnapshot, "providerProductId") ||
            "—"
          }
        />

        <DetailRow
          label="Product Type"
          value={formatLabel(getString(providerSnapshot, "productType"))}
        />

        <DetailRow
          label="Base Plan ID"
          value={getString(providerSnapshot, "basePlanId") || "—"}
        />

        <DetailRow
          label="Offer ID"
          value={getString(providerSnapshot, "offerId") || "—"}
        />

        <DetailRow
          label="Provider Transaction ID"
          value={providerTransactionId || "—"}
        />

        <DetailRow label="Purchase Token Hash" value={tokenHash || "—"} />

        <DetailRow
          label="Provider Reference"
          value={getString(payment, "providerReference") || "—"}
        />

        <DetailRow label="Verified At" value={formatDateTime(verifiedAt)} />

        <DetailRow label="Paid At" value={formatDateTime(paidAt)} />

        <DetailRow label="Refunded At" value={formatDateTime(refundedAt)} />
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
              Refund settlement is handled by the provider. Entitlement reversal
              is handled by backend only.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SmallDetail
            label="Refund Status"
            value={formatLabel(refundStatus)}
          />

          <SmallDetail
            label="Refund Reason"
            value={
              getString(refundOperation, "reason") ||
              getString(payment, "refundReason") ||
              "—"
            }
          />

          <SmallDetail
            label="Refund Source"
            value={formatLabel(getString(refundOperation, "source"))}
          />

          <SmallDetail
            label="Provider Completed At"
            value={formatDateTime(
              getString(refundOperation, "providerCompletedAt"),
            )}
          />

          <SmallDetail
            label="Completed At"
            value={formatDateTime(getString(refundOperation, "completedAt"))}
          />

          <SmallDetail
            label="Failure Code"
            value={getString(refundOperation, "failureCode") || "—"}
          />

          <SmallDetail
            label="Failure Message"
            value={getString(refundOperation, "failureMessage") || "—"}
          />

          <SmallDetail
            label="Reversed Voice Minutes"
            value={getString(reversal, "voiceMinutes") || "0"}
          />

          <SmallDetail
            label="Reversed Text Tokens"
            value={getString(reversal, "textTokens") || "0"}
          />

          <SmallDetail
            label="Reversed Streak Freezes"
            value={getString(reversal, "freezeCount") || "0"}
          />

          <SmallDetail
            label="Reversed CV Credits"
            value={getString(reversal, "cvCredits") || "0"}
          />

          <SmallDetail
            label="Protection Granted Until"
            value={formatDateTime(
              getString(reversal, "unlimitedProtectionGrantedUntil"),
            )}
          />
        </div>
      </div>

      {subscription && (
        <div className="mt-8 rounded-3xl border border-[#DDE5DE] bg-[#F7FAF7] p-6">
          <h3 className="text-base font-bold text-[#202420]">
            Subscription Lifecycle
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SmallDetail
              label="Subscription Status"
              value={getString(subscription, "status") || "—"}
            />

            <SmallDetail
              label="Entitlement Active"
              value={
                typeof subscription.entitlementActive === "boolean"
                  ? subscription.entitlementActive
                    ? "Yes"
                    : "No"
                  : "—"
              }
            />

            <SmallDetail
              label="Auto-renew Enabled"
              value={
                typeof subscription.autoRenewEnabled === "boolean"
                  ? subscription.autoRenewEnabled
                    ? "Yes"
                    : "No"
                  : "—"
              }
            />

            <SmallDetail
              label="Started At"
              value={formatDateTime(getString(subscription, "startedAt"))}
            />

            <SmallDetail
              label="Expires At"
              value={formatDateTime(getString(subscription, "expiresAt"))}
            />

            <SmallDetail
              label="Canceled At"
              value={formatDateTime(getString(subscription, "canceledAt"))}
            />

            <SmallDetail
              label="Revoked At"
              value={formatDateTime(getString(subscription, "revokedAt"))}
            />

            <SmallDetail
              label="Last Synced At"
              value={formatDateTime(getString(subscription, "lastSyncedAt"))}
            />

            <SmallDetail
              label="Environment"
              value={formatLabel(getString(subscription, "environment"))}
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
