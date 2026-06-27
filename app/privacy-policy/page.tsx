import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { privacyPolicy } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy | Italir Pothe",
  description: "Privacy Policy for the Italir Pothe mobile application and services.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage document={privacyPolicy} />;
}
