import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import FinalExamSetupClient from "./_components/final-exam-setup-client";

interface FinalExamSetupPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function FinalExamSetupPage({
  params,
}: FinalExamSetupPageProps) {
  const resolvedParams = await params;
  const finalExamId = resolvedParams.id;

  if (!isValidUuid(finalExamId)) {
    notFound();
  }

  return <FinalExamSetupClient finalExamId={finalExamId} />;
}
