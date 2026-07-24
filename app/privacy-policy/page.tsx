import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { privacyPolicy } from "@/components/legal/legal-content";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Italir Pothe Privacy Policy to understand how personal information is collected, used, stored and protected.",
};

type PrivacyPolicyPageProps = {
  searchParams: Promise<{
    embedded?: string;
  }>;
};

export default async function PrivacyPolicyPage({
  searchParams,
}: PrivacyPolicyPageProps) {
  const params = await searchParams;
  const isEmbedded = params.embedded === "true";

  const document = <LegalDocumentPage document={privacyPolicy} />;

  if (isEmbedded) {
    return <main>{document}</main>;
  }

  return <PublicPageShell>{document}</PublicPageShell>;
}
