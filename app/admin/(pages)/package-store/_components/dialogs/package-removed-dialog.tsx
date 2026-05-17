import { Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PackageRemovedDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#FFDCDD] text-[#D92D20]">
          <Trash2 className="size-7" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-[#202420]">
          Package Removed
        </h2>

        <p className="mx-auto mt-3 max-w-[260px] text-sm leading-6 text-[#5F675F]">
          The package has been deleted from the monetization suite.
        </p>

        <Button fullWidth className="mt-7" onClick={onClose}>
          Continue
        </Button>

        <button className="mt-5 text-xs text-[#5F675F]">UNDO ACTION</button>
      </div>
    </Dialog>
  );
}
