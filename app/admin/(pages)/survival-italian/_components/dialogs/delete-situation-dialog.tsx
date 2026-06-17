import { TriangleAlert } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { SurvivalSituation } from "@/types/survival-italian/survival-italian.type";

interface Props {
  open: boolean;
  situation: SurvivalSituation | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteSituationDialog({
  open,
  situation,
  isDeleting = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#FDECEC]">
          <TriangleAlert className="size-9 text-[#D92D20]" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Delete Situation?
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#66736B]">
          Are you sure you want to delete the
          <span className="font-semibold text-[#202420]">
            {` '${situation?.title || "selected"}' `}
          </span>
          situation? This action will permanently remove all linked sentences
          and resources from the mobile app and cannot be undone.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            fullWidth
            variant="outline"
            size="lg"
            disabled={isDeleting}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            size="lg"
            disabled={isDeleting}
            className="bg-[#D92D20] hover:bg-[#B42318]"
            onClick={onConfirm}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
