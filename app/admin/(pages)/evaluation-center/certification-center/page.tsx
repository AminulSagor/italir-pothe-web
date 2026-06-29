import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import CertificationCenterClient from "./_components/certification-center-client";

interface CertificationCenterPageProps {
  searchParams: Promise<{
    attemptId?: string | string[];
    tab?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export default async function CertificationCenterPage({
  searchParams,
}: CertificationCenterPageProps) {
  const params = await searchParams;

  const attemptId = getSingleValue(params.attemptId);

  const tab = getSingleValue(params.tab);

  if (!isValidUuid(attemptId)) {
    notFound();
  }

  return (
    <CertificationCenterClient
      attemptId={attemptId}
      requestedTab={
        tab === "request-retake" ? "request-retake" : "issue-certificate"
      }
    />
  );
}
