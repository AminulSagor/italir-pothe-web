import {
  CheckCircle2,
  Clock3,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  Store,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import type {
  CourseEnrollment,
  CourseEnrollmentDetails,
} from "@/types/course-directory/course-commerce.type";

interface CoursePurchaseBillingDetailsCardProps {
  enrollment: CourseEnrollment | CourseEnrollmentDetails;
}

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

const getTokenHash = (
  enrollment: CourseEnrollment | CourseEnrollmentDetails,
) => {
  return (
    enrollment.verification?.purchaseTokenHash ||
    enrollment.verification?.tokenHash ||
    "—"
  );
};

const getVerificationStyle = (status?: string | null) => {
  if (status === "verified") {
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
  const verificationStatus = enrollment.verification?.status || "pending";

  const verificationStyle = getVerificationStyle(verificationStatus);

  const VerificationIcon = verificationStyle.icon;

  const storeProduct = enrollment.storeProduct;

  const payment = enrollment.payment;

  const subscription = enrollment.subscription;

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
            Read-only purchase verification and store product information. Full
            purchase tokens and raw signed payloads are never shown here.
          </p>
        </div>
      </div>

      <section className="rounded-3xl border border-[#E3EAE4] p-5">
        <div className="mb-4 flex items-center gap-3">
          <Store className="size-5 text-[#006B3F]" />

          <h4 className="font-bold text-[#202420]">Provider Snapshot</h4>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailBox
            label="Provider"
            value={formatLabel(storeProduct?.provider || payment?.provider)}
          />

          <DetailBox
            label="Product Type"
            value={formatLabel(storeProduct?.productType)}
          />

          <DetailBox
            label="Product ID"
            value={storeProduct?.productId || "—"}
          />

          <DetailBox
            label="Base Plan / Purchase Option ID"
            value={storeProduct?.basePlanId || "—"}
          />

          <DetailBox label="Offer ID" value={storeProduct?.offerId || "—"} />

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
            Environment: {formatLabel(enrollment.verification?.environment)}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailBox
            label="Provider Transaction ID"
            value={enrollment.verification?.providerTransactionId || "—"}
          />

          <DetailBox
            label="Purchase Token Hash"
            value={getTokenHash(enrollment)}
          />

          <DetailBox
            label="Provider Reference"
            value={payment?.providerReference || "—"}
          />

          <DetailBox
            label="Verified At"
            value={formatDateTime(enrollment.verification?.verifiedAt)}
          />

          <DetailBox
            label="Completed At"
            value={formatDateTime(payment?.paidAt)}
          />

          <DetailBox
            label="Refunded At"
            value={formatDateTime(payment?.refundedAt)}
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
            label="Refund Status"
            value={payment?.refundedAt ? "Refunded / Revoked" : "Not refunded"}
          />

          <DetailBox
            label="Refund Reason"
            value={payment?.refundReason || "—"}
          />

          <DetailBox label="Failure Code" value={payment?.failureCode || "—"} />

          <DetailBox
            label="Failure Message"
            value={payment?.failureMessage || "—"}
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
              value={formatLabel(subscription.status)}
            />

            <DetailBox
              label="Entitlement Active"
              value={
                subscription.entitlementActive === null ||
                subscription.entitlementActive === undefined
                  ? "—"
                  : subscription.entitlementActive
                    ? "Yes"
                    : "No"
              }
            />

            <DetailBox
              label="Auto-renew Enabled"
              value={
                subscription.autoRenewEnabled === null ||
                subscription.autoRenewEnabled === undefined
                  ? "—"
                  : subscription.autoRenewEnabled
                    ? "Yes"
                    : "No"
              }
            />

            <DetailBox
              label="Started At"
              value={formatDateTime(subscription.startedAt)}
            />

            <DetailBox
              label="Expires At"
              value={formatDateTime(subscription.expiresAt)}
            />

            <DetailBox
              label="Canceled At"
              value={formatDateTime(subscription.canceledAt)}
            />

            <DetailBox
              label="Revoked At"
              value={formatDateTime(subscription.revokedAt)}
            />

            <DetailBox
              label="Last Synced At"
              value={formatDateTime(subscription.lastSyncedAt)}
            />

            <DetailBox
              label="Environment"
              value={formatLabel(subscription.environment)}
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
