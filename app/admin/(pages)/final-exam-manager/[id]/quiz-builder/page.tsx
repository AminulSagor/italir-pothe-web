import QuizBuilderClient from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/quiz-builder-client";
import { quizBuilderMockData } from "@/mock/quiz-builder/quiz-builder.mock";

const page = () => {
  return (
    <QuizBuilderClient data={quizBuilderMockData} headerVariant="final-exam" />
  );
};

export default page;
