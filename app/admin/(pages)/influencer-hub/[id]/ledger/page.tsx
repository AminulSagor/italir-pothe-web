import InfluencerLedgerClient from "./_components/influencer-ledger-client";

interface InfluencerLedgerPageProps {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    dateFrom?: string | string[];
    dateTo?: string | string[];
    transactionType?: string | string[];
    status?: string | string[];
  }>;
}

const one = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export default async function InfluencerLedgerPage({
  params,
  searchParams,
}: InfluencerLedgerPageProps) {
  const { id } = await params;
  const query = await searchParams;

  return (
    <InfluencerLedgerClient
      partnerId={id}
      dateFrom={one(query.dateFrom)}
      dateTo={one(query.dateTo)}
      transactionType={one(query.transactionType)}
      status={one(query.status)}
    />
  );
}
