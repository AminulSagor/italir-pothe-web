"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import EndWebinarDialog from "./_components/end-webinar-dialog";
import SpeakerRequestsPanel from "@/app/admin/(pages)/webinar-directory/handle/_components/speaker-requests-panel";
import LiveAudienceChat from "@/app/admin/(pages)/webinar-directory/handle/_components/live-audience-chat";
import LiveWebinarPlayer from "@/app/admin/(pages)/webinar-directory/handle/_components/live-webinar-player";
import BackButton from "@/components/UI/buttons/back-button";

export default function WebinarHandlePage() {
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#F5F8F2] px-6 py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-center gap-4">
          <BackButton />
          <p className="text-sm font-semibold text-[#007A4D]">Webinar Handle</p>
        </div>

        <div className="mb-8 flex items-center justify-between gap-5">
          <div className="flex items-center gap-7">
            <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              ● LIVE
            </span>
            <h1 className="text-2xl font-bold text-[#007A4D]">
              Grammar Q&amp;A
            </h1>
            <span className="h-6 w-px bg-[#DAE4D8]" />
            <p className="font-mono text-sm font-semibold tracking-widest text-[#007A4D]">
              00:15:42
            </p>
          </div>

          <button
            onClick={() => setIsEndDialogOpen(true)}
            className="rounded-full bg-[#C91F1F] px-8 py-4 text-xs font-bold uppercase text-white shadow-lg"
          >
            ⛔ End Webinar
          </button>
        </div>

        <section className="grid gap-7 lg:grid-cols-[1fr_350px]">
          <div className="space-y-7">
            <LiveWebinarPlayer />
            <LiveAudienceChat />
          </div>

          <SpeakerRequestsPanel />
        </section>
      </div>

      <EndWebinarDialog
        open={isEndDialogOpen}
        onClose={() => setIsEndDialogOpen(false)}
      />
    </main>
  );
}
