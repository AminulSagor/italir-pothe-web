import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Languages,
  MessageCircle,
  Mic2,
} from "lucide-react";

import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { DownloadAppButton } from "@/components/public/shared/download-app-button";
import { PageHero } from "@/components/public/shared/page-hero";
import { PUBLIC_COURSES } from "@/constant/public-site.constant";
import type { PublicCourse } from "@/types/public-site/public-site.type";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Explore practical Italian language, speaking and career-focused learning programs from Italir Pothe.",
};

const iconMap: Record<PublicCourse["icon"], typeof Languages> = {
  languages: Languages,
  "message-circle": MessageCircle,
  "briefcase-business": BriefcaseBusiness,
  "mic-2": Mic2,
};

export default function CoursesPage() {
  return (
    <PublicPageShell>
      <PageHero
        actions={
          <>
            <DownloadAppButton label="App Coming Soon" size="lg" />
            <Link
              className="inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full border border-[#BFD3C6] bg-white px-7 font-bold text-[#25302B] transition hover:bg-[#EEF6F0]"
              href="/certificates/verify"
            >
              Verify a Certificate
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </>
        }
        description="Learn through structured lessons, practical examples, speaking activities, quizzes and measurable progress."
        eyebrow="Italian learning programs"
        title="Build skills for everyday life and professional growth"
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {PUBLIC_COURSES.map((course) => {
            const Icon = iconMap[course.icon];

            return (
              <article
                className="rounded-[2rem] border border-[#DCE7E0] bg-[#FBFDFC] p-7 shadow-sm sm:p-8"
                key={course.title}
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="grid size-14 place-items-center rounded-2xl bg-[#17211D] text-white">
                    <Icon aria-hidden="true" size={27} />
                  </span>
                  <span className="rounded-full bg-[#E7F5EC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#087448]">
                    {course.level}
                  </span>
                </div>
                <h2 className="mt-7 text-2xl font-black tracking-[-0.04em] text-[#17211D] sm:text-3xl">
                  {course.title}
                </h2>
                <p className="mt-4 leading-7 text-[#627067]">
                  {course.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {course.highlights.map((highlight) => (
                    <li
                      className="flex items-center gap-3 text-sm font-semibold text-[#445149]"
                      key={highlight}
                    >
                      <span className="grid size-6 place-items-center rounded-full bg-[#DDF3E8] text-[#087448]">
                        <Check aria-hidden="true" size={15} strokeWidth={3} />
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#F3F8F4] py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-[-0.045em] text-[#17211D] sm:text-4xl">
            Full course access will be available in the mobile app
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5F6C65]">
            The Italir Pothe app is being prepared for release. Tap below to
            view the coming-soon notice.
          </p>
          <div className="mt-8">
            <DownloadAppButton label="Get App Update" size="lg" />
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
