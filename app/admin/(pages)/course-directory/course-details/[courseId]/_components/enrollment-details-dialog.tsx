"use client";

import { Loader2, RotateCcw, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { CourseEnrollmentDetails } from "@/types/course-directory/course-commerce.type";
import CoursePurchaseBillingDetailsCard from "./course-purchase-billing-details-card";

interface EnrollmentDetailsDialogProps {
  open: boolean;
  enrollment: CourseEnrollmentDetails | null;
  isLoading: boolean;
  isRefunding: boolean;
  onClose: () => void;
  onRefund: () => void;
}

const formatLabel = (value: string) => {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const formatDate = (value: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

const EnrollmentDetailsDialog = ({
  open,
  enrollment,
  isLoading,
  isRefunding,
  onClose,
  onRefund,
}: EnrollmentDetailsDialogProps) => {
  const canRefund =
    Boolean(enrollment?.orderId) && enrollment?.status !== "refunded";

  return (
    <Dialog open={open} onClose={onClose} size="lg" className="!p-0">
      <div className="flex items-start justify-between border-b border-black/10 px-7 py-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#006B3F]">
            Enrollment Details
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#202420]">
            {enrollment?.student.name || "Loading enrollment..."}
          </h2>
        </div>

        <button
          type="button"
          disabled={isRefunding}
          onClick={onClose}
          aria-label="Close enrollment details"
          className="flex size-9 items-center justify-center rounded-full text-black/55 hover:bg-[#F4F7F4]"
        >
          <X className="size-5" />
        </button>
      </div>

      {isLoading || !enrollment ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="size-7 animate-spin text-[#006B3F]" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 px-7 py-6 sm:grid-cols-2">
            <DetailItem
              label="Student ID"
              value={
                enrollment.student.studentCode || enrollment.student.id || "—"
              }
            />

            <DetailItem label="Email" value={enrollment.student.email || "—"} />

            <DetailItem label="Phone" value={enrollment.student.phone || "—"} />

            <DetailItem
              label="Amount Paid"
              value={formatCurrency(enrollment.amountPaid, enrollment.currency)}
            />

            <DetailItem label="Status" value={formatLabel(enrollment.status)} />

            <DetailItem
              label="Payment Provider"
              value={formatLabel(enrollment.paymentProvider)}
            />

            <DetailItem
              label="Payment Status"
              value={
                enrollment.paymentStatus
                  ? formatLabel(enrollment.paymentStatus)
                  : "—"
              }
            />

            <DetailItem
              label="Enrolled At"
              value={formatDate(enrollment.enrolledAt)}
            />

            <DetailItem label="Order ID" value={enrollment.orderId || "—"} />

            <DetailItem
              label="Payment Reference"
              value={enrollment.paymentReference || "—"}
            />
          </div>

          <div className="border-t border-black/10 px-7 py-4">
            <p className="rounded-2xl bg-[#FFF7E6] px-4 py-3 text-xs leading-5 text-[#8A5A00]">
              This action requests or records provider refund/revocation and
              revokes the course entitlement when applicable. The frontend does
              not verify purchases, grant course access, or revoke access
              locally.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-black/10 px-7 py-5">
            {enrollment && (
              <div className="px-7 pb-6">
                <CoursePurchaseBillingDetailsCard enrollment={enrollment} />
              </div>
            )}
            <Button variant="outline" disabled={isRefunding} onClick={onClose}>
              Close
            </Button>

            {canRefund && (
              <Button
                disabled={isRefunding || !enrollment?.orderId}
                onClick={onRefund}
                className="gap-2 !bg-[#D34A3A] hover:!bg-[#B83B2E]"
              >
                {isRefunding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RotateCcw className="size-4" />
                )}

                {isRefunding ? "Processing..." : "Refund / Revoke Access"}
              </Button>
            )}
            <div className="border-t border-black/10 px-7 py-4">
              <p className="rounded-2xl bg-[#FFF7E6] px-4 py-3 text-xs leading-5 text-[#8A5A00]">
                This action requests or records provider refund/revocation and
                revokes the course entitlement when applicable. The frontend
                does not verify purchases or grant/revoke access locally.
              </p>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div className="rounded-2xl bg-[#F7FAF6] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-black/45">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-[#202420]">
        {value}
      </p>
    </div>
  );
};

export default EnrollmentDetailsDialog;
