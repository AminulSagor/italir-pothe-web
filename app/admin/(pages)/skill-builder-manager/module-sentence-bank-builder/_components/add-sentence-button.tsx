import { PlusCircle } from "lucide-react";

export default function AddSentenceButton() {
  return (
    <button
      type="button"
      className="flex h-[88px] w-full items-center justify-center gap-3 rounded-[36px] border border-dashed border-[#B7C5B8] bg-[#F7FAF6] text-[#7C857D] transition hover:bg-[#F1F5EF]"
    >
      <PlusCircle className="size-5" />
      <span className="text-base font-medium">Add Sentence</span>
    </button>
  );
}
