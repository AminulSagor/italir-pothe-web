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

        <h2 className="text-xl font-bold text-[#D92D20]">Refund Order</h2>
        <p className="mt-2 text-sm text-[#4F5B52]">
          This demo refund reverses unused package entitlements.
        </p>
      </div>

      <div className="px-7 py-6">
        <label className="mb-2 block text-xs font-medium text-[#5F675F]">
          REFUND REASON
        </label>
        <textarea
          value={reason}
          disabled={isSubmitting}
          onChange={(event) => onReasonChange(event.target.value)}
          maxLength={500}
          placeholder="Enter the reason for this refund"
          className="min-h-32 w-full rounded-3xl bg-[#EEF2EC] px-5 py-4 text-sm outline-none placeholder:text-[#AAB3AD]"
        />
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
          {isSubmitting ? "Refunding..." : "Confirm Refund"}
        </Button>
      </div>
    </Dialog>
  );
}
