"use client";

import { AlertTriangle, Loader2, ShieldCheck, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface RestrictionConfirmDialogProps {
  open: boolean;

  user: {
    fullName: string;
    isRestricted: boolean;
  } | null;

  isSubmitting: boolean;

  onClose: () => void;
  onConfirm: () => void;
}

export default function RestrictionConfirmDialog({
  open,
  user,
  isSubmitting,
  onClose,
  onConfirm,
}: RestrictionConfirmDialogProps) {
  if (!user) return null;

  const isRestoring = user.isRestricted;

  const Icon = isRestoring ? ShieldCheck : AlertTriangle;

  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
        aria-label="Close restriction confirmation"
      >
        <X className="size-4" />
      </button>

      <div className="text-center">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${
            isRestoring
              ? "bg-[#DDF3E8] text-secondary"
              : "bg-[#FFDCDD] text-[#D92D20]"
          }`}
        >
          <Icon className="size-7" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-black/85">
          {isRestoring ? "Unrestrict User" : "Restrict User"}
        </h2>

        <p className="mx-auto mt-3 max-w-[320px] text-sm leading-6 text-black/55">
          {isRestoring
            ? `Restore ${user.fullName}'s access to the application?`
            : `Restrict ${user.fullName}'s account from accessing the application?`}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            fullWidth
            disabled={isSubmitting}
            onClick={onClose}
          >
            Close
          </Button>

          <Button
            fullWidth
            disabled={isSubmitting}
            onClick={onConfirm}
            className={isRestoring ? "" : "!bg-[#D92D20] hover:!bg-[#B42318]"}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
