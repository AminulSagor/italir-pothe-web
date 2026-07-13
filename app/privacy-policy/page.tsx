import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { privacyPolicy } from "@/components/legal/legal-content";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Italir Pothe Privacy Policy to understand how personal information is collected, used, stored and protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <PublicPageShell>
      <LegalDocumentPage document={privacyPolicy} />
    </PublicPageShell>
  );
}