import type { Metadata } from "next";

import { CertificateVerifyForm } from "@/components/public/certificate/certificate-verify-form";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { PageHero } from "@/components/public/shared/page-hero";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description:
    "Verify an Italir Pothe certificate using its unique identifier.",
};

export default function CertificateVerifyPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Public verification"
        title="Verify an Italir Pothe certificate"
        description="Enter the certificate identifier to open and verify the official public certificate record."
      />

      <section className="bg-[#F4FAF5] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <CertificateVerifyForm />
        </div>
      </section>
    </PublicPageShell>
  );
}