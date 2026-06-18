import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import FinalExamQuizBuilderClient from "./_components/final-exam-quiz-builder-client";

interface FinalExamQuizBuilderPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function FinalExamQuizBuilderPage({
  params,
}: FinalExamQuizBuilderPageProps) {
  const resolvedParams = await params;
  const finalExamId = resolvedParams.id;

  if (!isValidUuid(finalExamId)) {
    notFound();
  }

  return <FinalExamQuizBuilderClient finalExamId={finalExamId} />;
}
