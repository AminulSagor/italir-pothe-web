import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
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
            <DownloadAppButton
              label="Get it on Google Play"
              showArrow
              size="lg"
            />
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

          <div className="relative mx-auto w-[290px] overflow-hidden rounded-[3rem] border-[10px] border-[#17211D] bg-white shadow-[0_35px_80px_rgba(18,52,35,0.25)] sm:w-[330px]">
            <Image
              alt="Italir Pothe Android app home screen showing learning progress and quick tools"
              className="h-auto w-full"
              height={2622}
              priority
              sizes="(min-width: 640px) 310px, 270px"
              src="/images/italir-pothe-app-home.jpeg"
              width={1206}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
