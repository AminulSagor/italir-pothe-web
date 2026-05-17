import { Plus, Search } from "lucide-react";

import Button from "@/components/UI/buttons/button";

export default function VocabularyToolbar() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex h-12 w-full items-center gap-3 rounded-full bg-[#E4EAE1] px-5 text-[#8D9890] sm:max-w-[430px]">
        <Search className="size-5 shrink-0" />
        <input
          type="text"
          placeholder="Search words..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#A8B2AA]"
        />
      </div>

      <Button size="lg" className="w-full gap-2 sm:w-auto">
        <Plus className="size-4" />
        Add New Word
      </Button>
    </div>
  );
}
