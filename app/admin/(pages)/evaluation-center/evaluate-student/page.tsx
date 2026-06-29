import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import EvaluationBoardClient from "./_components/evaluation-board-client";

interface EvaluateStudentPageProps {
  searchParams: Promise<{
    attemptId?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export default async function EvaluateStudentPage({
  searchParams,
}: EvaluateStudentPageProps) {
  const params = await searchParams;

  const attemptId = getSingleValue(params.attemptId);

  if (!isValidUuid(attemptId)) {
    notFound();
  }

  return <EvaluationBoardClient attemptId={attemptId} />;
}
