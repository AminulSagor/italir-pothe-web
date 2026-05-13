import { Save } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import { syllabusBuilderMockData } from "@/mock/syllabus-builder/syllabus-builder.mock";

import SyllabusChapterCard from "./_components/syllabus-chapter-card";
import SyllabusHeader from "./_components/syllabus-header";
import SyllabusSummaryCard from "./_components/syllabus-summary-card";

export default function SyllabusBuilderPage() {
  const totalLessons = syllabusBuilderMockData.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0,
  );

  return (
    <main>
      <div className="space-y-6">
        <SyllabusHeader />

        <SyllabusSummaryCard
          totalChapters={syllabusBuilderMockData.length}
          totalLessons={totalLessons}
        />

        <div className="space-y-5">
          {syllabusBuilderMockData.map((chapter) => (
            <SyllabusChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button size="lg" className="w-full gap-2 shadow-lg sm:w-auto">
            <Save className="size-4" />
            Save Syllabus Structure
          </Button>
        </div>
      </div>
    </main>
  );
}
