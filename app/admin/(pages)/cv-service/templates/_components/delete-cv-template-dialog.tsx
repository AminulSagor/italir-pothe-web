"use client";

import ConfirmActionDialog from "@/components/UI/dialogs/confirm-action-dialog";

interface DeleteCVTemplateDialogProps {
  open: boolean;
  templateName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteCVTemplateDialog({
  open,
  templateName,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteCVTemplateDialogProps) {
  return (
    <ConfirmActionDialog
      open={open}
      title="Delete CV Template"
      description={`Delete "${templateName}"? This template will no longer be available in the application.`}
      confirmLabel="Delete Template"
      danger
      isSubmitting={isDeleting}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}