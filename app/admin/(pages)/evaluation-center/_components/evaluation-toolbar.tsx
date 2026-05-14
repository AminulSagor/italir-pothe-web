import { Search, SlidersHorizontal } from "lucide-react";

export default function EvaluationToolbar() {
  return (
    <div className="space-y-4">
      <div className="flex h-14 items-center gap-3 rounded-full bg-white px-5 shadow-sm">
        <Search className="size-4 text-[#6B776F]" />

        <input
          placeholder="Search by student name or ID..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#A0AAA2]"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-full bg-[#EEF5EE] px-5 py-3 text-xs font-medium text-[#4F5B52]">
          <SlidersHorizontal className="size-3" />
          SORT: TIME IN QUEUE⌄
        </button>

        <button className="inline-flex items-center gap-2 rounded-full bg-[#EEF5EE] px-5 py-3 text-xs font-medium text-[#4F5B52]">
          <SlidersHorizontal className="size-3" />
          EXAM TYPE⌄
        </button>
      </div>
    </div>
  );
}
