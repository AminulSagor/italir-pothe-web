import { Check } from "lucide-react";
import Link from "next/link";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface CoursePublishedDialogProps {
  open: boolean;
  courseTitle: string;
  onClose: () => void;
}

const CoursePublishedDialog = ({
  open,
  courseTitle,
  onClose,
}: CoursePublishedDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <div className="py-2 text-center">
        <div className="relative mx-auto mb-8 flex size-20 items-center justify-center rounded-[26px] bg-[#6BFF46]">
          <div className="absolute -right-1 top-[-2px] size-4 rounded-full bg-[#B8F7A6]" />
          <div className="absolute bottom-1 left-[-6px] size-5 rounded-full bg-[#E2F3DE]" />

          <Check className="size-10 text-[#006B3F]" />
        </div>

        <h2 className="text-2xl font-bold text-[#006B3F]">Course Published!</h2>

        <p className="mx-auto mt-4 max-w-[260px] text-sm leading-6 text-black/60">
          The {courseTitle || "selected"} course is now live for all students.
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

export default CoursePublishedDialog;
