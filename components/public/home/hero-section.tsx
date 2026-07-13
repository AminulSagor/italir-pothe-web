import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  PlayCircle,
  Trophy,
} from "lucide-react";

import { DownloadAppButton } from "@/components/public/shared/download-app-button";

const appHighlights = [
  { label: "Guided courses", icon: BookOpenCheck },
  { label: "Verified certificates", icon: BadgeCheck },
  { label: "XP and rewards", icon: Trophy },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4FAF5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(52,211,153,0.16),transparent_24%),radial-gradient(circle_at_90%_14%,rgba(132,204,22,0.14),transparent_25%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#CDE4D5] bg-white px-4 py-2 text-sm font-bold text-[#087448] shadow-sm">
            <span className="size-2 rounded-full bg-[#34D399]" />
            Learn Italian with Bangla-friendly support
          </div>

          <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.06em] text-[#17211D] sm:text-5xl lg:text-7xl">
            গ্রামারসহ সহজভাবে ইতালিয়ান ভাষা শিখুন
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5B6961] sm:text-xl">
            Build practical language skills, prepare for your career, join live
            webinars, complete examinations and earn verifiable certificates in
            one learning platform.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <DownloadAppButton label="Get the App" showArrow size="lg" />
            <Link
              className="inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full border border-[#BFD3C6] bg-white px-7 text-base font-bold text-[#25302B] transition hover:border-[#7CAC8D] hover:bg-[#EEF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2"
              href="/courses"
            >
              Explore Courses
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
            {appHighlights.map(({ label, icon: Icon }) => (
              <div
                className="flex items-center gap-3 rounded-2xl border border-[#DFE9E2] bg-white/80 px-4 py-3 text-sm font-bold text-[#445149] shadow-sm"
                key={label}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#E4F7EB] text-[#087448]">
                  <Icon aria-hidden="true" size={18} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -left-8 top-16 h-36 w-36 rounded-full bg-[#BDF3CF] blur-3xl" />
          <div className="absolute -right-6 bottom-12 h-40 w-40 rounded-full bg-[#E1F6B8] blur-3xl" />

          <div className="relative mx-auto w-[290px] rounded-[3rem] border-[10px] border-[#17211D] bg-white p-3 shadow-[0_35px_80px_rgba(18,52,35,0.25)] sm:w-[330px]">
            <div className="mx-auto mb-3 h-5 w-28 rounded-full bg-[#17211D]" />
            <div className="overflow-hidden rounded-[2.2rem] bg-[#F3F8F4]">
              <div className="bg-gradient-to-br from-[#006B3F] to-[#0A7C58] px-5 pb-7 pt-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  Today&apos;s learning
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
                  Ciao! Ready to continue?
                </h2>
                <div className="mt-5 rounded-2xl bg-white/12 p-4 backdrop-blur">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Course progress</span>
                    <span>62%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                    <div className="h-full w-[62%] rounded-full bg-[#75FF33]" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5">
                <div className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-[#E0E9E3]">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[#E5F7EC] text-[#087448]">
                    <PlayCircle aria-hidden="true" size={23} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.12em] text-[#7A877F]">
                      Continue lesson
                    </span>
                    <span className="mt-1 block truncate text-sm font-black text-[#223029]">
                      Everyday conversations
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#E0E9E3]">
                    <p className="text-xs font-bold text-[#7A877F]">
                      Current streak
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#17211D]">
                      7 days
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#E8F5ED] p-4 ring-1 ring-[#D2E9DA]">
                    <p className="text-xs font-bold text-[#54705F]">Total XP</p>
                    <p className="mt-2 text-2xl font-black text-[#087448]">
                      1,240
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#17211D] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white/60">
                        Upcoming
                      </p>
                      <p className="mt-1 text-sm font-black">
                        Live speaking webinar
                      </p>
                    </div>
                    <span className="rounded-full bg-[#75FF33] px-3 py-1 text-xs font-black text-[#17211D]">
                      Soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
