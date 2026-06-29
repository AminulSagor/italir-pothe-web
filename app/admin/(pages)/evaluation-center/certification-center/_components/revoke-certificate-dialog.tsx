"use client";

import { Loader2, ShieldX, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface RevokeCertificateDialogProps {
  open: boolean;
  reason: string;
  isSubmitting: boolean;

  onReasonChange: (value: string) => void;

  onClose: () => void;
  onConfirm: () => void;
}

export default function RevokeCertificateDialog({
  open,
  reason,
  isSubmitting,
  onReasonChange,
  onClose,
  onConfirm,
}: RevokeCertificateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="md" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
          aria-label="Close revoke-certificate dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="flex items-center gap-3 text-xl font-bold text-[#B42318]">
          <ShieldX className="size-5" />
          Revoke Certificate
        </h2>
      </div>

      <div className="space-y-5 px-7 py-6">
        <p className="text-sm leading-6 text-[#66736A]">
          The certificate will no longer pass verification after revocation.
        </p>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
            Revocation Reason (Optional)
          </span>

          <textarea
            value={reason}
            maxLength={500}
            disabled={isSubmitting}
            onChange={(event) => onReasonChange(event.target.value)}
            className="min-h-32 w-full resize-none rounded-[1.5rem] bg-[#EEF3EC] p-4 text-sm outline-none"
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Close
        </Button>

        <Button
          disabled={isSubmitting}
          onClick={onConfirm}
          className="!bg-[#D92D20] hover:!bg-[#B42318]"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <ShieldX className="mr-2 size-4" />
          )}
          Confirm Revocation
        </Button>
      </div>
    </Dialog>
  );
}
