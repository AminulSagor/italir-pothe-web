import { Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface RemoveLessonDialogProps {
  open: boolean;
  lessonTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveLessonDialog({
  open,
  lessonTitle,
  onClose,
  onConfirm,
}: RemoveLessonDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#DDF3E8]">
          <Trash2 className="size-6 text-[#007A4A]" />
        </div>

        <h2 className="text-xl font-bold text-[#202420]">
          Remove {lessonTitle}?
        </h2>

        <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-[#66736B]">
          Are you sure you want to remove this lesson from the current module?
          The lesson will be moved to the archive.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg" onClick={onClose}>
            Keep Lesson
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-full bg-[#C91818] px-6 text-sm font-bold text-white shadow-md transition hover:bg-[#AA1414]"
          >
            Remove
          </button>
        </div>
      </div>
    </Dialog>
  );
}
