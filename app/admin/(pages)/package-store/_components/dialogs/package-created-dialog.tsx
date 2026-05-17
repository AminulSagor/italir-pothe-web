import { PackageCheck } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PackageCreatedDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#B9F2C9] text-[#006B3F]">
          <PackageCheck className="size-9" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-[#006B3F]">
          Package Created!
        </h2>

        <p className="mx-auto mt-3 max-w-[250px] text-sm leading-6 text-[#5F675F]">
          Your new package has been added to the store inventory.
        </p>

        <Button fullWidth className="mt-7" onClick={onClose}>
          Manage Store →
        </Button>

        <button className="mt-5 text-xs font-bold text-[#006B3F]">
          CREATE ANOTHER
        </button>
      </div>
    </Dialog>
  );
}
