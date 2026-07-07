import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { termsOfService } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Terms & Conditions | Italir Pothe",
  description: "Terms and Conditions for the Italir Pothe mobile application and services.",
};

export default function TermsAndConditionsPage() {
  return <LegalDocumentPage document={termsOfService} />;
}
