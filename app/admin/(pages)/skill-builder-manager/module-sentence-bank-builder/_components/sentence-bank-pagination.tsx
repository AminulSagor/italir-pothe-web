import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SentenceBankPagination() {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-[#66736B]">
        Showing <span className="text-[#006B3F]">1–10</span> of{" "}
        <span className="text-[#006B3F]">48</span> sentences
      </p>

      <div className="flex items-center gap-2">
        <button className="flex size-11 items-center justify-center rounded-full border border-[#DCE5DA]">
          <ChevronLeft className="size-5" />
        </button>

        <button className="flex size-11 items-center justify-center rounded-full bg-[#006B3F] text-white">
          1
        </button>

        <button className="size-11">2</button>
        <button className="size-11">3</button>

        <span>...</span>

        <button className="size-11">5</button>

        <button className="flex size-11 items-center justify-center rounded-full border border-[#DCE5DA]">
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
