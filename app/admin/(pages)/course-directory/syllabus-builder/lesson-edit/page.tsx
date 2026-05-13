import { syllabusLessonEditMockData } from "@/mock/syllabus-lesson-edit/syllabus-lesson-edit.mock";

import AccessControlCard from "./_components/access-control-card";
import ExercisesCard from "./_components/exercises-card";
import LessonActionPanel from "./_components/lesson-action-panel";
import LessonEditHeader from "./_components/lesson-edit-header";
import MediaOverviewCard from "./_components/media-overview-card";
import TheoryResourcesCard from "./_components/theory-resources-card";

export default function LessonEditPage() {
  return (
    <main>
      <div className="space-y-6">
        <LessonEditHeader />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
          <div className="space-y-6">
            <MediaOverviewCard lesson={syllabusLessonEditMockData} />
            <TheoryResourcesCard lesson={syllabusLessonEditMockData} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <AccessControlCard />
            <ExercisesCard />
            <LessonActionPanel />
          </aside>
        </div>
      </div>
    </main>
  );
}
