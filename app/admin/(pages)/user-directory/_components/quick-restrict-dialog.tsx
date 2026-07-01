"use client";

import { Loader2, ShieldBan, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface QuickRestrictDialogProps {
  open: boolean;
  identifier: string;
  isSubmitting: boolean;

  onIdentifierChange: (value: string) => void;

  onClose: () => void;
  onConfirm: () => void;
}

export default function QuickRestrictDialog({
  open,
  identifier,
  isSubmitting,
  onIdentifierChange,
  onClose,
  onConfirm,
}: QuickRestrictDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="md" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
          aria-label="Close quick restrict dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="flex items-center gap-3 text-xl font-bold text-secondary">
          <ShieldBan className="size-5" />
          Quick Ban
        </h2>
      </div>

      <div className="space-y-5 px-7 py-6">
        <p className="text-sm leading-6 text-black/55">
          Enter the exact user UUID, email address, or phone number. The matched
          user account will be restricted after confirmation.
        </p>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase text-black/40">
            User Identifier
          </span>

          <input
            value={identifier}
            maxLength={255}
            disabled={isSubmitting}
            placeholder="UUID, email address, or phone number"
            onChange={(event) => onIdentifierChange(event.target.value)}
            className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-sm outline-none"
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Close
        </Button>

        <Button
          disabled={isSubmitting || !identifier.trim()}
          onClick={onConfirm}
          className="!bg-[#D92D20] hover:!bg-[#B42318]"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <ShieldBan className="mr-2 size-4" />
          )}
          Confirm Restriction
        </Button>
      </div>
    </Dialog>
  );
}
