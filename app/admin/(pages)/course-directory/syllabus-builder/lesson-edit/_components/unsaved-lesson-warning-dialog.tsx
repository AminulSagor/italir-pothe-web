import { TriangleAlert } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface UnsavedLessonWarningDialogProps {
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export default function UnsavedLessonWarningDialog({
  open,
  onCancel,
  onOk,
}: UnsavedLessonWarningDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} size="sm" position="center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#FFF2CC]">
          <TriangleAlert className="size-8 text-[#B54708]" />
        </div>

        <h2 className="text-xl font-bold text-[#202420]">
          Discard Unsaved Changes?
        </h2>

        <p className="mx-auto mt-3 max-w-[300px] text-sm leading-6 text-[#66736B]">
          You have unsaved changes. If you continue, your latest changes will be
          lost.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg" onClick={onCancel}>
            Cancel
          </Button>

          <Button size="lg" onClick={onOk}>
            OK
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
