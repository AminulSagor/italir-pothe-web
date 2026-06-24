"use client";

import { Loader2, Send, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface SendRewardUpdateDialogProps {
  open: boolean;
  title: string;
  body: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function SendRewardUpdateDialog({
  open,
  title,
  body,
  isSubmitting,
  onTitleChange,
  onBodyChange,
  onClose,
  onSubmit,
}: SendRewardUpdateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="md" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
          aria-label="Close update dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-bold text-secondary">
          Send Update Notification
        </h2>
      </div>

      <div className="space-y-5 px-7 py-6">
        <label>
          <span className="mb-2 block text-xs font-bold uppercase text-black/40">
            Notification Title
          </span>

          <input
            value={title}
            maxLength={180}
            disabled={isSubmitting}
            placeholder="Reward update"
            onChange={(event) => onTitleChange(event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase text-black/40">
            Message
          </span>

          <textarea
            value={body}
            maxLength={1000}
            disabled={isSubmitting}
            placeholder="Write the reward update message..."
            onChange={(event) => onBodyChange(event.target.value)}
            className="min-h-36 w-full resize-none rounded-[2rem] bg-[#EEF3EC] p-5 text-sm outline-none"
          />
        </label>

        <p className="text-xs text-black/40">
          Both fields are optional. The backend will use the default reward
          update message when they are empty.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={isSubmitting} onClick={onSubmit}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          Send Update
        </Button>
      </div>
    </Dialog>
  );
}
