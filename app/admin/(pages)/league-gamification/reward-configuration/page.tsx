import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";
import RewardConfigurationClient from "./_components/reward-configuration-client";

interface RewardConfigurationPageProps {
  searchParams: Promise<{
    userId?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export default async function RewardConfigurationPage({
  searchParams,
}: RewardConfigurationPageProps) {
  const params = await searchParams;
  const userId = getSingleValue(params.userId);

  if (!isValidUuid(userId)) {
    notFound();
  }

  return <RewardConfigurationClient userId={userId} />;
}
