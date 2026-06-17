"use client";

import { Plus } from "lucide-react";

interface Props {
  isCreating?: boolean;
  onAdd: () => void;
}

export default function AddCareerTrackCard({
  isCreating = false,
  onAdd,
}: Props) {
  return (
    <button
      type="button"
      disabled={isCreating}
      onClick={onAdd}
      className="flex min-h-[470px] w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#CAD3CB] bg-transparent p-10 transition hover:border-[#006B3F] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-[#E3E7E0]">
        <Plus className="size-9 text-[#202420]" />
      </div>

      <div className="mt-8 max-w-[220px] text-center">
        <h3 className="text-2xl font-medium text-[#202420]">
          {isCreating ? "Opening..." : "New Career Track"}
        </h3>

        <p className="mt-3 text-base leading-7 text-[#5F675F]">
          Define a custom professional language path.
        </p>
      </div>
    </button>
  );
}
