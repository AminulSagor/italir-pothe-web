"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface UnsavedChangesWarningDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const UnsavedChangesWarningDialog = ({
  open,
  onCancel,
  onConfirm,
}: UnsavedChangesWarningDialogProps) => {
  return (
    <Dialog open={open} onClose={onCancel} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#FFF0D6] text-[#C46A00]">
          <AlertTriangle className="size-7" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-[#202420]">
          Unsaved Changes
        </h2>

        <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-[#5F675F]">
          You have unsaved changes. Leaving this page will discard them.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Button variant="outline" fullWidth onClick={onCancel}>
            Cancel
          </Button>

          <Button fullWidth onClick={onConfirm}>
            OK
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default UnsavedChangesWarningDialog;
