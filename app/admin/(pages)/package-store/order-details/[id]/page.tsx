import { notFound } from "next/navigation";

import { isValidUuid } from "@/utils/uuid";

import OrderDetailsClient from "./_components/order-details-client";

interface OrderDetailsPageProps {
  params: Promise<{
    id?: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  if (!isValidUuid(orderId)) {
    notFound();
  }

  return <OrderDetailsClient orderId={orderId} />;
}
