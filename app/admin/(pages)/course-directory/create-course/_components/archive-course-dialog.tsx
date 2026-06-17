import { Archive, TriangleAlert } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface ArchiveCourseDialogProps {
  open: boolean;
  courseTitle: string;
  isArchiving?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ArchiveCourseDialog = ({
  open,
  courseTitle,
  isArchiving = false,
  onClose,
  onConfirm,
}: ArchiveCourseDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[#FFF2CC] shadow-lg shadow-yellow-100">
          <TriangleAlert className="size-10 text-[#B54708]" />
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">
          Archive {courseTitle}?
        </h2>

        <p className="mx-auto mt-4 max-w-[340px] text-sm leading-6 text-black/65">
          This will archive the selected course from the directory. You can
          restore it later from the course status option.
        </p>

        <div className="mt-8 space-y-4">
          <Button
            fullWidth
            size="lg"
            disabled={isArchiving}
            onClick={onConfirm}
            className="!bg-[#006B3F] text-white hover:!bg-[#00552E]"
          >
            <Archive className="mr-2 size-5" />
            {isArchiving ? "Archiving..." : "OK, Archive Course"}
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="ghost"
            disabled={isArchiving}
            onClick={onClose}
            className="!bg-[#E1E7DE] text-[#3F463F] hover:!bg-[#D8DED5]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ArchiveCourseDialog;
