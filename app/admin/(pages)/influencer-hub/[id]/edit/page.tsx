import InfluencerPartnerForm from "../../deal-configurator/_components/influencer-partner-form";

interface EditInfluencerPartnerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditInfluencerPartnerPage({
  params,
}: EditInfluencerPartnerPageProps) {
  const { id } = await params;

  return <InfluencerPartnerForm mode="edit" partnerId={id} />;
}
