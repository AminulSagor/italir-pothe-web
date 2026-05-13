import { ArrowRight } from "lucide-react";
import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

interface ConfirmPriceChangeDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  previousPrice: string;
  newPrice: string;
}

const ConfirmPriceChangeDialog = ({
  open,
  onClose,
  onConfirm,
  previousPrice,
  newPrice,
}: ConfirmPriceChangeDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} size="md" position="center">
      <div>
        <h2 className="text-2xl font-bold text-[#202420]">
          Confirm Price Change?
        </h2>

        <p className="mt-3 text-sm text-black/60">
          Level A2: Intermediate Conversational Italian
        </p>

        <div className="my-12 flex items-center justify-between rounded-3xl border border-dashed border-[#B9CDBE] bg-[#F6FAF5] px-8 py-8">
          <div className="text-center">
            <p className="mb-2 text-sm text-black/55">Previous</p>
            <p className="text-2xl font-bold text-black/35 line-through">
              €{previousPrice}
            </p>
          </div>

          <ArrowRight className="size-6 text-[#006B3F]" />

          <div className="text-center">
            <p className="mb-2 text-sm text-black/55">New Price</p>
            <p className="text-2xl font-bold text-[#006B3F]">€{newPrice}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            size="lg"
            onClick={onConfirm}
            className="!bg-[#58F447] text-[#006B3F]"
          >
            Confirm
          </Button>

          <Button
            size="lg"
            variant="ghost"
            onClick={onClose}
            className="!bg-[#E1E7DE] text-[#3F463F]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmPriceChangeDialog;
