import { Trash2, TriangleAlert } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { QuizDeleteSafety } from "@/types/course-directory/quiz.type";

interface QuizDeleteDialogProps {
  open: boolean;
  quizTitle: string;
  deleteSafety: QuizDeleteSafety | null;
  isDeleting?: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
}

export default function QuizDeleteDialog({
  open,
  quizTitle,
  deleteSafety,
  isDeleting = false,
  onClose,
  onDeleteConfirm,
}: QuizDeleteDialogProps) {
  const canDelete = Boolean(deleteSafety?.canDeletePermanently);

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
            ? `Permanently Delete ${quizTitle}?`
            : "Permanent Delete Not Possible"}
        </h2>

        <p className="mx-auto mt-4 max-w-[400px] text-sm leading-6 text-black/65">
          {canDelete
            ? "This permanently removes the quiz and its questions. This cannot be undone."
            : (deleteSafety?.recommendation ??
              "This quiz cannot be permanently deleted right now.")}
        </p>

        {deleteSafety?.hasLearnerHistory ? (
          <p className="mx-auto mt-3 max-w-[360px] rounded-xl bg-[#F7FAF6] p-3 text-sm text-black/65">
            Learner sessions preserved: {deleteSafety.learnerSessionCount}
          </p>
        ) : null}

        <div className="mt-8 space-y-4">
          {canDelete ? (
            <Button
              fullWidth
              size="lg"
              variant="ghost"
              disabled={isDeleting}
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
}
