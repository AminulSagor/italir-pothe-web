import { Suspense } from "react";

import LessonEditContent from "./_components/lesson-edit-content";

export default function LessonEditPage() {
  return (
    <Suspense fallback={null}>
      <LessonEditContent />
    </Suspense>
  );
}
