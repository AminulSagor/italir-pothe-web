import { Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface DeleteLessonDialogProps {
  open: boolean;
  lessonTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteLessonDialog({
  open,
  lessonTitle,
  onClose,
  onConfirm,
}: DeleteLessonDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#FFE1E1]">
          <Trash2 className="size-6 text-[#C91818]" />
        </div>

        <h2 className="text-xl font-bold text-[#202420]">
          Delete {lessonTitle}?
        </h2>

        <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-[#66736B]">
          Are you sure you want to delete this lesson from the current chapter?
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg" onClick={onClose}>
            Cancel
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-full bg-[#C91818] px-6 text-sm font-bold text-white shadow-md transition hover:bg-[#AA1414]"
          >
            Delete
          </button>
        </div>
      </div>
    </Dialog>
  );
}
