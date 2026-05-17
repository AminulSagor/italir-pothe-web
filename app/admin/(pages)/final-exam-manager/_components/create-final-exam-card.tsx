import { Plus } from "lucide-react";

const CreateFinalExamCard = () => {
  return (
    <button
      type="button"
      className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#D7DED5] bg-[#F8FBF7] p-8 transition hover:border-[#006B3F]"
    >
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#EEF2EC]">
        <Plus className="size-8 text-[#6F7673]" />
      </div>

      <h3 className="text-lg font-semibold text-[#202420]">
        Create New Final Exam
      </h3>

      <p className="mt-2 text-sm text-[#6F7673]">Standard or Independent</p>
    </button>
  );
};

export default CreateFinalExamCard;
