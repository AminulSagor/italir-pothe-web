import Dialog from "@/components/UI/dialogs/dialog";
import Button from "@/components/UI/buttons/button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DeleteSituationDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-8">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#FDECEC] text-3xl">
          ⚠️
        </div>

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Delete Situation?
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#66736B]">
          Are you sure you want to delete the
          <span className="font-semibold text-[#202420]"> Grocery Store </span>
          situation? This action will permanently remove all linked sentences
          and resources from the mobile app and cannot be undone.
        </p>

        <div className="mt-8 flex gap-4">
          <Button fullWidth variant="outline" size="lg" onClick={onClose}>
            Cancel
          </Button>

          <Button
            fullWidth
            size="lg"
            className="bg-[#D92D20] hover:bg-[#B42318]"
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
