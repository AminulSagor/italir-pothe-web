"use client";

import { Loader2, RefreshCw, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface ReopenEvaluationDialogProps {
  open: boolean;
  reason: string;
  isSubmitting: boolean;

  onReasonChange: (value: string) => void;

  onClose: () => void;
  onConfirm: () => void;
}

export default function ReopenEvaluationDialog({
  open,
  reason,
  isSubmitting,
  onReasonChange,
  onClose,
  onConfirm,
}: ReopenEvaluationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="md" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
          aria-label="Close re-evaluation dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-bold text-[#006B3F]">Re-evaluate Exam</h2>
      </div>

      <div className="px-7 py-6">
        <label>
          <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
            Reason (Optional)
          </span>

          <textarea
            value={reason}
            maxLength={500}
            disabled={isSubmitting}
            placeholder="Explain why this evaluation is being reopened..."
            onChange={(event) => onReasonChange(event.target.value)}
            className="min-h-32 w-full resize-none rounded-[1.5rem] bg-[#EEF3EC] p-4 text-sm outline-none"
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Close
        </Button>

        <Button disabled={isSubmitting} onClick={onConfirm}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 size-4" />
          )}
          Reopen Evaluation
        </Button>
      </div>
    </Dialog>
  );
}
