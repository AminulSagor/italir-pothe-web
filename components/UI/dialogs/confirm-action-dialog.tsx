"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface ConfirmActionDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  isSubmitting?: boolean;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmActionDialog = ({
  open,
  title,
  description,
  confirmLabel,
  isSubmitting = false,
  danger = false,
  onCancel,
  onConfirm,
}: ConfirmActionDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} size="sm" className="p-8">
      <div className="text-center">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${
            danger
              ? "bg-[#FFDCDD] text-[#D92D20]"
              : "bg-[#FFF0D6] text-[#C46A00]"
          }`}
        >
          <AlertTriangle className="size-7" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-[#202420]">{title}</h2>

        <p className="mx-auto mt-3 max-w-[290px] text-sm leading-6 text-[#5F675F]">
          {description}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            fullWidth
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            disabled={isSubmitting}
            onClick={onConfirm}
            className={danger ? "!bg-[#D92D20] hover:!bg-[#B42318]" : ""}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmActionDialog;
