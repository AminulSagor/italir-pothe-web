import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import RewardDetailClient from "./_components/reward-detail-client";

interface RewardDetailPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function RewardDetailPage({
  params,
}: RewardDetailPageProps) {
  const resolvedParams = await params;
  const rewardId = resolvedParams.id;

  if (!isValidUuid(rewardId)) {
    notFound();
  }

  return <RewardDetailClient rewardId={rewardId} />;
}
