import { CircleCheckBig } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface Props {
  open: boolean;
  situationName?: string;
  onClose: () => void;
}

export default function PublishSuccessDialog({
  open,
  situationName = "Situation",
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-[#B9F2C9]">
          <CircleCheckBig className="size-14 text-[#006B3F]" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-[#006B3F]">
          Situation Published Successfully!
        </h2>

        <p className="mx-auto mt-4 max-w-[280px] text-sm leading-6 text-[#66736B]">
          The
          <span className="font-semibold text-[#202420]">
            {` '${situationName}' `}
          </span>
          scenario has been updated and is now live for all students in the
          mobile app.
        </p>

        <Button fullWidth size="lg" className="mt-8" onClick={onClose}>
          DONE
        </Button>
      </div>
    </Dialog>
  );
}
