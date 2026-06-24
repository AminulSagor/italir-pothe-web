"use client";

import { AlertTriangle, CircleCheck, Loader2, Mail } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

type ConfirmAction = "deliver" | "revoke" | "request-address";

interface ConfirmRewardActionDialogProps {
  open: boolean;
  action: ConfirmAction | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const content: Record<
  ConfirmAction,
  {
    title: string;
    description: string;
    confirmLabel: string;
    danger: boolean;
    icon: React.ReactNode;
  }
> = {
  deliver: {
    title: "Mark Reward Delivered",

    description:
      "Confirm that this physical reward has been delivered to the recipient.",

    confirmLabel: "Mark Delivered",

    danger: false,

    icon: <CircleCheck className="size-7" />,
  },

  revoke: {
    title: "Revoke Reward",

    description:
      "The reward will no longer be available. This action cannot be reversed automatically.",

    confirmLabel: "Revoke Reward",

    danger: true,

    icon: <AlertTriangle className="size-7" />,
  },

  "request-address": {
    title: "Request Shipping Address",

    description:
      "A new shipping-address request notification will be queued for the recipient.",

    confirmLabel: "Send Request",

    danger: false,

    icon: <Mail className="size-7" />,
  },
};

export default function ConfirmRewardActionDialog({
  open,
  action,
  isSubmitting,
  onClose,
  onConfirm,
}: ConfirmRewardActionDialogProps) {
  if (!action) return null;

  const selectedContent = content[action];

  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div
          className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${
            selectedContent.danger
              ? "bg-[#FFDCDD] text-[#D92D20]"
              : "bg-[#DDF3E8] text-secondary"
          }`}
        >
          {selectedContent.icon}
        </div>

        <h2 className="mt-6 text-xl font-bold text-black/85">
          {selectedContent.title}
        </h2>

        <p className="mx-auto mt-3 max-w-[300px] text-sm leading-6 text-black/55">
          {selectedContent.description}
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
            className={
              selectedContent.danger ? "!bg-[#D92D20] hover:!bg-[#B42318]" : ""
            }
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}

            {selectedContent.confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
