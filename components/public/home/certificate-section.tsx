import Link from "next/link";
import { ArrowRight, BadgeCheck, ScanSearch, ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/public/shared/section-heading";

export function CertificateSection() {
  return (
    <section className="bg-[#F4FAF5] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionHeading
            description="Learners can complete assessments, receive evaluated certificates and share a public verification link when needed."
            eyebrow="Certification"
            title="Learning achievements that can be verified"
          />

          <div className="mt-8 space-y-4">
            {[
              "Complete course requirements and final assessments",
              "Receive an evaluated digital certificate",
              "Verify certificates online using a unique identifier",
            ].map((item) => (
              <div className="flex items-start gap-3" key={item}>
                <BadgeCheck
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#0A7C58]"
                  size={21}
                />
                <p className="leading-7 text-[#536159]">{item}</p>
              </div>
            ))}
          </div>

          <Link
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#006B3F] px-6 font-bold text-white transition hover:bg-[#005832] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2"
            href="/certificates/verify"
          >
            Verify a Certificate
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -inset-6 rounded-[3rem] bg-[#DDF3E8] blur-2xl" />
          <div className="relative rounded-[2rem] border border-[#CEE2D5] bg-white p-6 shadow-[0_24px_70px_rgba(21,74,45,0.13)] sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#E2EAE5] pb-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0A7C58]">
                  Certificate of completion
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#17211D]">
                  Italian Language Program
                </h3>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#E5F7EC] text-[#087448]">
                <ShieldCheck aria-hidden="true" size={25} />
              </span>
            </div>

            <div className="py-8 text-center">
              <p className="text-sm text-[#7A877F]">Awarded to</p>
              <p className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#17211D]">
                Learner Name
              </p>
              <p className="mt-3 text-sm leading-6 text-[#657269]">
                For successfully completing the required learning activities and
                final assessment.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#F0F7F2] p-4">
              <ScanSearch
                aria-hidden="true"
                className="text-[#0A7C58]"
                size={22}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#77847C]">
                  Public verification
                </p>
                <p className="mt-1 text-sm font-black text-[#25302B]">
                  Verify with a unique certificate ID
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
