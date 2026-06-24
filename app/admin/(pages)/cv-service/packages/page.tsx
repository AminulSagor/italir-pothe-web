import CvPackageConfigurationClient from "./_components/cv-package-configuration-client";

interface CvPackageConfigurationPageProps {
  searchParams: Promise<{
    search?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export default async function CvPackageConfigurationPage({
  searchParams,
}: CvPackageConfigurationPageProps) {
  const params = await searchParams;

  return (
    <CvPackageConfigurationClient search={getSingleValue(params.search)} />
  );
}
