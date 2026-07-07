import InfluencerReportClient from "./_components/influencer-report-client";

interface InfluencerDetailsPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    dateFrom?: string | string[];
    dateTo?: string | string[];
  }>;
}

const one = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export default async function InfluencerDetailsPage({
  params,
  searchParams,
}: InfluencerDetailsPageProps) {
  const { id } = await params;
  const query = await searchParams;

  return (
    <InfluencerReportClient
      partnerId={id}
      dateFrom={one(query.dateFrom)}
      dateTo={one(query.dateTo)}
    />
  );
}
