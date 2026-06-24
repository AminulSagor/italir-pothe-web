import { Loader2, RotateCcw, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface Props {
  open: boolean;
  packageName: string;
  mode: "archive" | "restore";
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PackageRemovedDialog({
  open,
  packageName,
  mode,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const isArchive = mode === "archive";

  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${
            isArchive
              ? "bg-[#FFDCDD] text-[#D92D20]"
              : "bg-[#DDF3E8] text-[#006B3F]"
          }`}
        >
          {isArchive ? (
            <Trash2 className="size-7" />
          ) : (
            <RotateCcw className="size-7" />
          )}
        </div>

        <h2 className="mt-6 text-xl font-bold text-[#202420]">
          {isArchive ? "Archive Package" : "Restore Package"}
        </h2>

        <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-[#5F675F]">
          {isArchive
            ? `${packageName} will be removed from the active store inventory.`
            : `${packageName} will become available in the store again.`}
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            fullWidth
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            fullWidth
            disabled={isSubmitting}
            onClick={onConfirm}
            className={isArchive ? "!bg-[#D92D20] hover:!bg-[#B42318]" : ""}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isArchive ? "Archive" : "Restore"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
