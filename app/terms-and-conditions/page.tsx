import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { termsOfService } from "@/components/legal/legal-content";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the Italir Pothe Terms and Conditions for using the website, mobile application, courses, books and related services.",
};

export default function TermsAndConditionsPage() {
  return (
    <PublicPageShell>
      <LegalDocumentPage document={termsOfService} />
    </PublicPageShell>
  );
}