import { quizBuilderMockData } from "@/mock/quiz-builder/quiz-builder.mock";
import QuizBuilderClient from "./_components/quiz-builder-client";

export default function QuizBuilderPage() {
  return <QuizBuilderClient data={quizBuilderMockData} />;
}
