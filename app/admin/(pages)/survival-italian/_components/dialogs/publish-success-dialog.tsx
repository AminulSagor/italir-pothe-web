import Dialog from "@/components/UI/dialogs/dialog";
import Button from "@/components/UI/buttons/button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PublishSuccessDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-[#B9F2C9] text-5xl">
          ✅
        </div>

        <h2 className="mt-6 text-2xl font-bold text-[#006B3F]">
          Situation Published Successfully!
        </h2>

        <p className="mx-auto mt-4 max-w-[260px] text-sm leading-6 text-[#66736B]">
          {`The "Bus & Tickets" scenario has been updated and is now live for all students in the mobile app.`}
        </p>

        <Button fullWidth size="lg" className="mt-8" onClick={onClose}>
          DONE
        </Button>
      </div>
    </Dialog>
  );
}
