import { Trash2 } from "lucide-react";
import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface DeleteCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onDeleteConfirm: () => void;
}

const DeleteCourseDialog = ({
  open,
  onClose,
  onDeleteConfirm,
}: DeleteCourseDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[#FFD6D6] shadow-lg shadow-red-200">
          <Trash2 className="size-10 text-[#C40000]" />
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">Delete Level A1?</h2>

        <p className="mx-auto mt-4 max-w-[320px] text-sm leading-6 text-black/65">
          This will permanently erase all lessons, quizzes, and student progress
          associated with the Italian Beginners curriculum. This action cannot
          be undone.
        </p>

        <div className="mt-8 space-y-4">
          <Button
            fullWidth
            size="lg"
            variant="ghost"
            onClick={() => onDeleteConfirm()}
            className="bg-[#FFD6D6] text-[#B00000] hover:bg-[#FFCACA]"
          >
            Delete Everything
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="ghost"
            onClick={onClose}
            className="bg-[#E1E7DE] text-[#3F463F] hover:bg-[#D8DED5]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DeleteCourseDialog;
