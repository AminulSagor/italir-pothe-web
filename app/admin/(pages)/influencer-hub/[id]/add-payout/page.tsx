import { redirect } from "next/navigation";

interface AddPayoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AddPayoutPage({ params }: AddPayoutPageProps) {
  const { id } = await params;

  redirect(`/admin/influencer-hub/${id}`);
}
