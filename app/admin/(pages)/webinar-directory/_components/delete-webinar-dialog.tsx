"use client";

import { Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

type DeleteWebinarDialogProps = {
  open: boolean;
  webinarTitle?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteWebinarDialog = ({
  open,
  webinarTitle,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteWebinarDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[#FFD6D6] shadow-lg shadow-red-200">
          <Trash2 className="size-10 text-[#C40000]" />
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">Delete Webinar?</h2>

        <p className="mx-auto mt-4 max-w-[340px] text-sm leading-6 text-black/65">
          {`This will permanently delete ${webinarTitle ? `"${webinarTitle}"` : "this webinar"}. This action cannot be undone.`}
        </p>

        <div className="mt-8 space-y-4">
          <Button
            fullWidth
            size="lg"
            variant="ghost"
            disabled={isDeleting}
            onClick={onConfirm}
            className="bg-[#FFD6D6] text-[#B00000] hover:bg-[#FFCACA]"
          >
            {isDeleting ? "Deleting..." : "Delete Webinar"}
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="ghost"
            disabled={isDeleting}
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

export default DeleteWebinarDialog;
