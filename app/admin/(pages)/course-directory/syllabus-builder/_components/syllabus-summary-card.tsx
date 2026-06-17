import { Folder, ListChecks, Plus } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

interface SyllabusSummaryCardProps {
  totalChapters: number;
  totalLessons: number;
  onAddChapter: () => void;
}

export default function SyllabusSummaryCard({
  totalChapters,
  totalLessons,
  onAddChapter,
}: SyllabusSummaryCardProps) {
  return (
    <Card
      padding="md"
      rounded="3xl"
      shadow="sm"
      className="flex flex-col gap-4 border border-[#E2E8E1] sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-col gap-3 text-sm text-[#66736B] sm:flex-row sm:items-center sm:gap-5">
        <div className="flex items-center gap-2">
          <Folder className="size-4" />
          <span>
            <strong className="font-semibold text-[#202420]">
              Total Chapters:
            </strong>{" "}
            {totalChapters}
          </span>
        </div>

        <div className="hidden h-4 w-px bg-[#D8E0D8] sm:block" />

        <div className="flex items-center gap-2">
          <ListChecks className="size-4" />
          <span>
            <strong className="font-semibold text-[#202420]">
              Total Lessons:
            </strong>{" "}
            {totalLessons}
          </span>
        </div>
      </div>

      <Button
        size="sm"
        className="w-full gap-2 sm:w-auto"
        onClick={onAddChapter}
      >
        <Plus className="size-4" />
        Add Chapter
      </Button>
    </Card>
  );
}
