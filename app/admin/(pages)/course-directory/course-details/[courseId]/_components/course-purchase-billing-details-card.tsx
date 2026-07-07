import {
  CheckCircle2,
  Clock3,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  Store,
} from "lucide-react";

import Card from "@/components/UI/cards/card";

interface CoursePurchaseBillingDetailsCardProps {
  enrollment: unknown;
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

const getBooleanText = (value: unknown) => {
  if (typeof value !== "boolean") {
    return "—";
  }

  return value ? "Yes" : "No";
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

const getVerificationStyle = (status?: string | null) => {
  if (status === "verified" || status === "completed") {
    return {
      icon: CheckCircle2,
      className: "bg-[#DDF3E8] text-[#006B3F]",
    };
  }

  if (status === "failed") {
    return {
      icon: ShieldAlert,
      className: "bg-[#FCEBEC] text-[#B42318]",
    };
  }

  return {
    icon: Clock3,
    className: "bg-[#FFF3C6] text-[#B77900]",
  };
};

export default function CoursePurchaseBillingDetailsCard({
  enrollment,
}: CoursePurchaseBillingDetailsCardProps) {
  const root = isRecord(enrollment) ? enrollment : {};

  const order = getRecord(root, "order");

  const providerSnapshot =
    getRecord(order, "providerSnapshot") || getRecord(root, "storeProduct");

  const providerTransaction =
    getRecord(order, "providerTransaction") || getRecord(root, "verification");

  const refundOperation =
    getRecord(order, "refundOperation") || getRecord(root, "refundOperation");

  const payment = getRecord(root, "payment");

  const subscription = getRecord(root, "subscription");

  const provider =
    getString(providerSnapshot, "provider") ||
    getString(providerTransaction, "provider") ||
    getString(payment, "provider") ||
    getString(order, "paymentProvider");

  const productId =
    getString(providerSnapshot, "productId") ||
    getString(providerSnapshot, "providerProductId") ||
    getString(providerTransaction, "productId");

  const productType = getString(providerSnapshot, "productType");

  const basePlanId = getString(providerSnapshot, "basePlanId");

  const offerId = getString(providerSnapshot, "offerId");

  const verificationStatus =
    getString(providerTransaction, "verificationStatus") ||
    getString(providerTransaction, "status") ||
    "pending";

  const verificationStyle = getVerificationStyle(verificationStatus);

  const VerificationIcon = verificationStyle.icon;

  const providerTransactionId = getString(
    providerTransaction,
    "providerTransactionId",
  );

  const tokenHash =
    getString(providerTransaction, "tokenHash") ||
    getString(providerTransaction, "purchaseTokenHash");

  const environment = getString(providerTransaction, "environment");

  const verifiedAt = getString(providerTransaction, "verifiedAt");

  const paidAt = getString(order, "paidAt") || getString(payment, "paidAt");

  const refundedAt =
    getString(order, "refundedAt") ||
    getString(payment, "refundedAt") ||
    getString(root, "refundedAt");

  return (
    <Card padding="lg" rounded="3xl" shadow="sm" className="space-y-7">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#FFF0D6] text-[#B66800]">
          <Store className="size-5" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#202420]">
            Provider Billing Details
          </h3>

          <p className="text-xs leading-5 text-[#7A847B]">
            Read-only course purchase verification details. Full purchase
            tokens, raw signed payloads and secrets are never shown here.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-[#E3EAE4] p-5">
        <div className="mb-4 flex items-center gap-3">
          <Store className="size-5 text-[#006B3F]" />

          <h4 className="font-bold text-[#202420]">Provider Snapshot</h4>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailBox label="Provider" value={formatLabel(provider)} />

          <DetailBox label="Product Type" value={formatLabel(productType)} />

          <DetailBox label="Product ID" value={productId || "—"} />

          <DetailBox
            label="Base Plan / Purchase Option ID"
            value={basePlanId || "—"}
          />

          <DetailBox label="Offer ID" value={offerId || "—"} />

          <DetailBox
            label="Expected Course Product Type"
            value="Non Consumable"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-[#E3EAE4] p-5">
        <div className="mb-4 flex items-center gap-3">
          <CreditCard className="size-5 text-[#006B3F]" />

          <h4 className="font-bold text-[#202420]">Provider Transaction</h4>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${verificationStyle.className}`}
          >
            <VerificationIcon className="size-3.5" />
            {formatLabel(verificationStatus)}
          </span>

          <span className="rounded-full bg-[#EEF3EC] px-3 py-1 text-xs font-bold text-[#4F5B52]">
            Environment: {formatLabel(environment)}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailBox
            label="Provider Transaction ID"
            value={providerTransactionId || "—"}
          />

          <DetailBox label="Purchase Token Hash" value={tokenHash || "—"} />

          <DetailBox label="Verified At" value={formatDateTime(verifiedAt)} />

          <DetailBox label="Completed At" value={formatDateTime(paidAt)} />

          <DetailBox label="Refunded At" value={formatDateTime(refundedAt)} />

          <DetailBox
            label="Order Status"
            value={formatLabel(getString(order, "status"))}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-[#F4D5D2] bg-[#FFF7F6] p-5">
        <div className="mb-4 flex items-center gap-3">
          <RotateCcw className="size-5 text-[#B42318]" />

          <h4 className="font-bold text-[#202420]">Refund / Reversal Info</h4>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailBox
            label="Refund Operation Status"
            value={formatLabel(getString(refundOperation, "status"))}
          />

          <DetailBox
            label="Refund Source"
            value={formatLabel(getString(refundOperation, "source"))}
          />

          <DetailBox
            label="Revoke Access"
            value={getBooleanText(
              isRecord(refundOperation) ? refundOperation.revoke : undefined,
            )}
          />

          <DetailBox
            label="Provider Completed At"
            value={formatDateTime(
              getString(refundOperation, "providerCompletedAt"),
            )}
          />

          <DetailBox
            label="Completed At"
            value={formatDateTime(getString(refundOperation, "completedAt"))}
          />

          <DetailBox
            label="Failure Code"
            value={getString(refundOperation, "failureCode") || "—"}
          />

          <DetailBox
            label="Failure Message"
            value={getString(refundOperation, "failureMessage") || "—"}
          />

          <DetailBox
            label="Reason"
            value={getString(refundOperation, "reason") || "—"}
          />
        </div>
      </section>

      {subscription && (
        <section className="rounded-3xl border border-[#DDE5DE] bg-[#F7FAF7] p-5">
          <h4 className="mb-4 font-bold text-[#202420]">
            Subscription Lifecycle
          </h4>

          <div className="grid gap-4 md:grid-cols-2">
            <DetailBox
              label="Subscription Status"
              value={formatLabel(getString(subscription, "status"))}
            />

            <DetailBox
              label="Entitlement Active"
              value={getBooleanText(subscription.entitlementActive)}
            />

            <DetailBox
              label="Auto-renew Enabled"
              value={getBooleanText(subscription.autoRenewEnabled)}
            />

            <DetailBox
              label="Started At"
              value={formatDateTime(getString(subscription, "startedAt"))}
            />

            <DetailBox
              label="Expires At"
              value={formatDateTime(getString(subscription, "expiresAt"))}
            />

            <DetailBox
              label="Canceled At"
              value={formatDateTime(getString(subscription, "canceledAt"))}
            />

            <DetailBox
              label="Revoked At"
              value={formatDateTime(getString(subscription, "revokedAt"))}
            />

            <DetailBox
              label="Last Synced At"
              value={formatDateTime(getString(subscription, "lastSyncedAt"))}
            />

            <DetailBox
              label="Environment"
              value={formatLabel(getString(subscription, "environment"))}
            />
          </div>
        </section>
      )}
    </Card>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#F7FAF7] px-4 py-3">
      <p className="text-[10px] font-bold uppercase text-[#8A948C]">{label}</p>

      <p className="mt-1 break-all text-sm font-semibold text-[#202420]">
        {value}
      </p>
    </div>
  );
}
