import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import UserDetailsClient from "./_components/user-details-client";

interface UserDetailsPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const resolvedParams = await params;

  const userId = resolvedParams.id;

  if (!isValidUuid(userId)) {
    notFound();
  }

  return <UserDetailsClient userId={userId} />;
}
