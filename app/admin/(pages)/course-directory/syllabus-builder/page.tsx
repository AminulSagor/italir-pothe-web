import { Suspense } from "react";

import SyllabusBuilderContent from "./_components/syllabus-builder-content";

export default function SyllabusBuilderPage() {
  return (
    <Suspense fallback={null}>
      <SyllabusBuilderContent />
    </Suspense>
  );
}
