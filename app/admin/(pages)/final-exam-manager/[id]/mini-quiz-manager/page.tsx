import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import ListeningMiniQuizBuilderClient from "./_components/listening-mini-quiz-builder-client";

interface MiniQuizManagerPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function MiniQuizManagerPage({
  params,
}: MiniQuizManagerPageProps) {
  const resolvedParams = await params;
  const finalExamId = resolvedParams.id;

  if (!isValidUuid(finalExamId)) {
    notFound();
  }

  return <ListeningMiniQuizBuilderClient finalExamId={finalExamId} />;
}
