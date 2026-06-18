import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import FinalExamSetupClient from "./_components/final-exam-setup-client";

interface FinalExamSetupPageProps {
  params: {
    id?: string;
  };
}

export default function FinalExamSetupPage({
  params,
}: FinalExamSetupPageProps) {
  const finalExamId = params.id;

  if (!isValidUuid(finalExamId)) {
    notFound();
  }

  return <FinalExamSetupClient finalExamId={finalExamId} />;
}
