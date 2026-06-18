import CareerTrackStudioContent from "./_components/career-track-studio-content";

interface CareerTrackStudioPageProps {
  searchParams: Promise<{
    careerTrackId?: string;
    mode?: string;
  }>;
}

export default async function CareerTrackStudioPage({
  searchParams,
}: CareerTrackStudioPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <CareerTrackStudioContent
      careerTrackIdFromUrl={resolvedSearchParams.careerTrackId || ""}
      mode={resolvedSearchParams.mode || ""}
    />
  );
}
