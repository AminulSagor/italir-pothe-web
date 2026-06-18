import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import FinalExamQuizBuilderClient from "./_components/final-exam-quiz-builder-client";

interface FinalExamQuizBuilderPageProps {
  params: {
    id?: string;
  };
}

export default function FinalExamQuizBuilderPage({
  params,
}: FinalExamQuizBuilderPageProps) {
  const finalExamId = params.id;

  if (!isValidUuid(finalExamId)) {
    notFound();
  }

  return <FinalExamQuizBuilderClient finalExamId={finalExamId} />;
}
