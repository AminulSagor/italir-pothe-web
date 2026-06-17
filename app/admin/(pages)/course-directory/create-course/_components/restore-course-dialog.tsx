import { RotateCcw, TriangleAlert } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { CourseStatus } from "@/types/course-directory/course.type";

interface RestoreCourseDialogProps {
  open: boolean;
  courseTitle: string;
  targetStatus: CourseStatus | null;
  isRestoring?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const getTargetLabel = (targetStatus: CourseStatus | null) => {
  if (targetStatus === "published") return "Published";
  if (targetStatus === "draft") return "Draft";
  return "active";
};

const RestoreCourseDialog = ({
  open,
  courseTitle,
  targetStatus,
  isRestoring = false,
  onClose,
  onConfirm,
}: RestoreCourseDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[#FFF2CC] shadow-lg shadow-yellow-100">
          <TriangleAlert className="size-10 text-[#B54708]" />
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">
          Restore {courseTitle}?
        </h2>

        <p className="mx-auto mt-4 max-w-[340px] text-sm leading-6 text-black/65">
          This course is currently archived. Do you want to restore it back to{" "}
          {getTargetLabel(targetStatus)} status?
        </p>

        <div className="mt-8 space-y-4">
          <Button
            fullWidth
            size="lg"
            disabled={isRestoring}
            onClick={onConfirm}
            className="!bg-[#006B3F] text-white hover:!bg-[#00552E]"
          >
            <RotateCcw className="mr-2 size-5" />
            {isRestoring ? "Restoring..." : "OK, Restore Course"}
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="ghost"
            disabled={isRestoring}
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

export default RestoreCourseDialog;
