import type { Metadata } from "next";

import { BookSection } from "@/components/public/home/book-section";
import { CertificateSection } from "@/components/public/home/certificate-section";
import { CoursePreviewSection } from "@/components/public/home/course-preview-section";
import { FeatureSection } from "@/components/public/home/feature-section";
import { FinalCtaSection } from "@/components/public/home/final-cta-section";
import { HeroSection } from "@/components/public/home/hero-section";
import { LearningJourneySection } from "@/components/public/home/learning-journey-section";
import { WebinarSection } from "@/components/public/home/webinar-section";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";

export const metadata: Metadata = {
  title: "Learn Italian with Bangla-Friendly Guidance",
  description:
    "Explore Italir Pothe courses, career learning, live webinars, exams, verified certificates and printed Italian-learning books.",
};

export default function HomePage() {
  return (
    <PublicPageShell>
      <HeroSection />
      <FeatureSection />
      <LearningJourneySection />
      <CoursePreviewSection />
      <BookSection />
      <CertificateSection />
      <WebinarSection />
      <FinalCtaSection />
    </PublicPageShell>
  );
}