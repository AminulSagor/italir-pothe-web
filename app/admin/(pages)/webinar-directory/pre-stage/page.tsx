import { ArrowLeft } from "lucide-react";

import WebinarPreviewCard from "./_components/webinar-preview-card";
import WebinarDetailsCard from "./_components/webinar-details-card";
import TechnicalChecklist from "@/app/admin/(pages)/webinar-directory/pre-stage/_components/technical-checklist-card";
import Link from "next/link";

export default function WebinarPreStagePage() {
  return (
    <main className="min-h-screen bg-[#F5F8F2] px-6 py-5">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex size-10 items-center justify-center rounded-full bg-white text-[#007A4D] shadow-sm">
              <ArrowLeft className="size-5" />
            </button>
            <p className="text-sm font-semibold text-[#007A4D]">
              Webinar Pre Stage
            </p>
          </div>

          <Link
            href="/admin/webinar-directory/handle"
            className="rounded-full bg-[#007A4D] px-9 py-4 text-xs font-bold uppercase tracking-wide text-white shadow-lg"
          >
            Start Webinar
          </Link>
        </div>

        <div className="mb-7">
          <h1 className="text-3xl font-bold text-[#007A4D]">
            Webinar Staging: Grammar Q&amp;A
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[#4E5A52]">
            Verify your audio, video, and connection stability before going live
            to your students and followers.
          </p>
        </div>

        <section className="mb-7 grid gap-7 lg:grid-cols-[1fr_340px]">
          <WebinarPreviewCard />
          <TechnicalChecklist />
        </section>

        <WebinarDetailsCard />
      </div>
    </main>
  );
}
