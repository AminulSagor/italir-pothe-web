import { Trash2, X } from "lucide-react";
import Link from "next/link";
import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface CourseDeletedDialogProps {
  open: boolean;
  onClose: () => void;
}

const CourseDeletedDialog = ({ open, onClose }: CourseDeletedDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6"
        aria-label="Close dialog"
      >
        <X className="size-5 text-[#202420]" />
      </button>

      <div className="text-center">
        <div className="mx-auto mb-7 flex size-20 items-center justify-center rounded-full bg-[#FFE2E2]">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#FFD0D0]">
            <Trash2 className="size-6 text-[#D00000]" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#202420]">Course Deleted</h2>

        <p className="mx-auto mt-4 max-w-[250px] text-sm leading-6 text-black/60">
          The selected course has been successfully removed from the directory.
        </p>

        <Link href="/admin/course-directory" className="mt-8 block">
          <Button fullWidth size="lg">
            Return to Directory
          </Button>
        </Link>
      </div>
    </Dialog>
  );
};

export default CourseDeletedDialog;
