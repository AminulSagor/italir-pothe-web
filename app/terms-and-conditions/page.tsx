import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { termsOfService } from "@/components/legal/legal-content";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Italir Pothe Terms and Conditions for using the website, mobile application, courses, books and related services.",
};

type TermsAndConditionsPageProps = {
  searchParams: Promise<{
    embedded?: string;
  }>;
};

export default async function TermsAndConditionsPage({
  searchParams,
}: TermsAndConditionsPageProps) {
  const params = await searchParams;

  const isEmbedded = params.embedded === "true";

  const document = <LegalDocumentPage document={termsOfService} />;

  if (isEmbedded) {
    return <main>{document}</main>;
  }

  return <PublicPageShell>{document}</PublicPageShell>;
}
