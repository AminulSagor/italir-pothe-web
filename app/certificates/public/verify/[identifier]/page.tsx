import PublicCertificateVerifyClient from "./_components/public-certificate-verify-client";

interface PublicCertificateVerifyPageProps {
  params: Promise<{
    identifier: string;
  }>;
}

export default async function PublicCertificateVerifyPage({
  params,
}: PublicCertificateVerifyPageProps) {
  const { identifier } = await params;

  return <PublicCertificateVerifyClient identifier={identifier} />;
}
