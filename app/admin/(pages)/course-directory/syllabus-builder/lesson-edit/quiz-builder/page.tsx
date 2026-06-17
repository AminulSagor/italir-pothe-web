import { Suspense } from "react";

import QuizBuilderClient from "./_components/quiz-builder-client";

export default function QuizBuilderPage() {
  return (
    <Suspense fallback={null}>
      <QuizBuilderClient />
    </Suspense>
  );
}
