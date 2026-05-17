import { Plus } from "lucide-react";

const AddNextQuestionCard = () => {
  return (
    <button
      type="button"
      className="flex min-h-[140px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#D5DED5] bg-[#FBFCFA] transition hover:border-[#006B3F]"
    >
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[#EFF3ED]">
        <Plus className="size-5 text-[#4F5B55]" />
      </div>

      <p className="text-sm font-medium text-[#6F7673]">Add Next Question</p>
    </button>
  );
};

export default AddNextQuestionCard;
