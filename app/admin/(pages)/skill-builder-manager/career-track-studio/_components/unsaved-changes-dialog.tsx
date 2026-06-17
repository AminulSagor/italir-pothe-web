import { TriangleAlert } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface UnsavedChangesDialogProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export default function UnsavedChangesDialog({
  open,
  onCancel,
  onOk,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#FDECEC]">
          <TriangleAlert className="size-9 text-[#D92D20]" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Unsaved Changes
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#66736B]">
          You have unsaved changes. Are you sure you want to leave this page?
        </p>

        <div className="mt-8 flex gap-4">
          <Button fullWidth variant="outline" size="lg" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            fullWidth
            size="lg"
            className="bg-[#D92D20] hover:bg-[#B42318]"
            onClick={onOk}
          >
            OK
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
