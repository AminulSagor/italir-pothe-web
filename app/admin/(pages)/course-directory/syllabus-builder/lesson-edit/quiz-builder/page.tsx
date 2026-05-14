import { Suspense } from "react";

import { quizBuilderMockData } from "@/mock/quiz-builder/quiz-builder.mock";

import QuizBuilderClient from "./_components/quiz-builder-client";

export default function QuizBuilderPage() {
  return (
    <Suspense fallback={null}>
      <QuizBuilderClient data={quizBuilderMockData} />
    </Suspense>
  );
}
