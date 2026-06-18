import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import ListeningMiniQuizBuilderClient from "./_components/listening-mini-quiz-builder-client";

interface MiniQuizManagerPageProps {
  params: {
    id?: string;
  };
}

export default function MiniQuizManagerPage({
  params,
}: MiniQuizManagerPageProps) {
  const finalExamId = params.id;

  if (!isValidUuid(finalExamId)) {
    notFound();
  }

  return <ListeningMiniQuizBuilderClient finalExamId={finalExamId} />;
}
