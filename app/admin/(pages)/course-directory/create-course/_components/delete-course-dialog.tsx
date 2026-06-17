import { Trash2, TriangleAlert } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { CourseDeleteSafety } from "@/types/course-directory/course.type";

interface DeleteCourseDialogProps {
  open: boolean;
  courseTitle: string;
  deleteSafety: CourseDeleteSafety | null;
  isDeleting?: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
}

const DeleteCourseDialog = ({
  open,
  courseTitle,
  deleteSafety,
  isDeleting = false,
  onClose,
  onDeleteConfirm,
}: DeleteCourseDialogProps) => {
  const canDelete = Boolean(deleteSafety?.canDeletePermanently);
  const dependencies = deleteSafety?.dependencies;

  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <div className="text-center">
        <div
          className={`mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl shadow-lg ${
            canDelete
              ? "bg-[#FFD6D6] shadow-red-200"
              : "bg-[#FFF2CC] shadow-yellow-100"
          }`}
        >
          {canDelete ? (
            <Trash2 className="size-10 text-[#C40000]" />
          ) : (
            <TriangleAlert className="size-10 text-[#B54708]" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">
          {canDelete
            ? `Permanently Delete ${courseTitle}?`
            : "Permanent Delete Not Possible"}
        </h2>

        {canDelete ? (
          <p className="mx-auto mt-4 max-w-[340px] text-sm leading-6 text-black/65">
            This action will permanently delete the selected course and cannot
            be undone.
          </p>
        ) : (
          <div className="mx-auto mt-4 max-w-[360px] text-sm leading-6 text-black/65">
            <p>
              {deleteSafety?.recommendation ||
                "This course cannot be permanently deleted right now."}
            </p>

            {dependencies ? (
              <div className="mt-4 rounded-2xl bg-[#F7FAF6] p-4 text-left">
                <p>
                  Chapters:{" "}
                  <span className="font-semibold">
                    {dependencies.chapterCount}
                  </span>
                </p>

                <p>
                  Lessons:{" "}
                  <span className="font-semibold">
                    {dependencies.lessonCount}
                  </span>
                </p>

                <p>
                  Has Dependencies:{" "}
                  <span className="font-semibold">
                    {dependencies.hasDependencies ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {canDelete ? (
            <Button
              fullWidth
              size="lg"
              disabled={isDeleting}
              variant="ghost"
              onClick={onDeleteConfirm}
              className="!bg-[#D00000] text-white hover:!bg-[#B00000]"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </Button>
          ) : null}

          <Button
            fullWidth
            size="lg"
            variant="ghost"
            disabled={isDeleting}
            onClick={onClose}
            className="!bg-[#E1E7DE] text-[#3F463F] hover:!bg-[#D8DED5]"
          >
            {canDelete ? "Cancel" : "OK"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteCourseDialog;
