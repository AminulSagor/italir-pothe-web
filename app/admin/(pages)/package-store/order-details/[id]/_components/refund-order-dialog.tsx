"use client";

import { Loader2, RotateCcw, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface RefundOrderDialogProps {
  open: boolean;
  reason: string;
  isSubmitting: boolean;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RefundOrderDialog({
  open,
  reason,
  isSubmitting,
  onReasonChange,
  onClose,
  onConfirm,
}: RefundOrderDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="md" className="p-0">
      <div className="border-b border-[#EEF2EE] px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF2EE] disabled:opacity-60"
          aria-label="Close refund dialog"
        >
          <X className="size-4 text-[#4D574F]" />
        </button>

        <h2 className="text-xl font-bold text-[#D92D20]">
          Refund / Revoke Access
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#4F5B52]">
          This will request or record a provider refund/revocation and revoke
          the user entitlement when applicable. Continue?
        </p>
      </div>

      <div className="px-7 py-6">
        <label className="mb-2 block text-xs font-medium text-[#5F675F]">
          REFUND / REVOCATION REASON
        </label>

        <textarea
          value={reason}
          disabled={isSubmitting}
          onChange={(event) => onReasonChange(event.target.value)}
          maxLength={500}
          placeholder="Enter the reason for this refund or access revocation"
          className="min-h-32 w-full rounded-3xl bg-[#EEF2EC] px-5 py-4 text-sm outline-none placeholder:text-[#AAB3AD]"
        />

        <p className="mt-3 rounded-2xl bg-[#FFF7E6] px-4 py-3 text-xs leading-5 text-[#8A5A00]">
          Google Play refund/revoke is handled by the backend provider
          integration. App Store refunds usually arrive through App Store Server
          Notifications, so this action should not promise an instant Apple
          refund unless the backend provider endpoint supports it.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F6F8F4] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Cancel
        </Button>

        <Button
          disabled={isSubmitting}
          onClick={onConfirm}
          className="gap-2 !bg-[#D92D20] hover:!bg-[#B42318]"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RotateCcw className="size-4" />
          )}

          {isSubmitting ? "Processing..." : "Confirm Refund / Revoke"}
        </Button>
      </div>
    </Dialog>
  );
}
