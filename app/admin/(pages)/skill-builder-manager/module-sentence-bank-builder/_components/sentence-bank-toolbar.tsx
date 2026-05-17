import { Search, SlidersHorizontal } from "lucide-react";

export default function SentenceBankToolbar() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#202420]">
          Master Sentence Bank
        </h2>

        <p className="mt-1 text-sm text-[#66736B]">
          48 total sentences in current module
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 lg:w-[320px]">
          <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#98A198]" />

          <input
            type="text"
            placeholder="Search sentences..."
            className="h-14 w-full rounded-full bg-[#EEF2ED] pl-14 pr-5 text-sm outline-none placeholder:text-[#98A198]"
          />
        </div>

        <button
          type="button"
          className="flex size-14 items-center justify-center rounded-full border border-[#DCE5DA] bg-white"
        >
          <SlidersHorizontal className="size-5 text-[#202420]" />
        </button>
      </div>
    </div>
  );
}
