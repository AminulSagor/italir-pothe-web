import { Square } from "lucide-react";

import Dialog from "@/components/UI/dialogs/dialog";

type EndWebinarDialogProps = {
  open: boolean;
  isEnding: boolean;
  participantCount: number;
  onClose: () => void;
  onConfirm: () => void;
};

export default function EndWebinarDialog({
  open,
  isEnding,
  participantCount,
  onClose,
  onConfirm,
}: EndWebinarDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="lg" className="!p-0">
      <div className="px-12 py-14 text-center">
        <div className="mx-auto mb-7 flex size-20 items-center justify-center rounded-full bg-red-100 text-[#C91F1F]">
          <Square className="size-7 fill-current" />
        </div>

        <h2 className="mb-5 text-xl font-bold text-[#202420]">
          End Live Stream?
        </h2>

        <p className="mx-auto mb-9 max-w-[340px] text-sm leading-6 text-[#5D655F]">
          This will disconnect {participantCount} participant
          {participantCount === 1 ? "" : "s"} and mark this webinar as
          completed. You cannot resume this specific session once ended.
        </p>

        <div className="flex justify-center gap-5">
          <button
            type="button"
            disabled={isEnding}
            onClick={onConfirm}
            className="rounded-full bg-[#C91F1F] px-9 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isEnding ? "Ending..." : "End for Everyone"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isEnding}
            className="rounded-full bg-[#E4E9E1] px-9 py-3 text-sm font-semibold text-[#5D655F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
}
