import { Loader2, Plus } from "lucide-react";

interface CreateFinalExamCardProps {
  isCreating?: boolean;
  onClick: () => void;
}

const CreateFinalExamCard = ({
  isCreating = false,
  onClick,
}: CreateFinalExamCardProps) => {
  return (
    <button
      type="button"
      disabled={isCreating}
      onClick={onClick}
      className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#D7DED5] bg-[#F8FBF7] p-8 transition hover:border-[#006B3F] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#EEF2EC]">
        {isCreating ? (
          <Loader2 className="size-8 animate-spin text-[#6F7673]" />
        ) : (
          <Plus className="size-8 text-[#6F7673]" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-[#202420]">
        {isCreating ? "Creating Final Exam..." : "Create New Final Exam"}
      </h3>

      <p className="mt-2 text-sm text-[#6F7673]">Standard or Independent</p>
    </button>
  );
};

export default CreateFinalExamCard;
