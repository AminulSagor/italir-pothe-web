import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Languages,
  MessageCircle,
  Mic2,
} from "lucide-react";

import { SectionHeading } from "@/components/public/shared/section-heading";
import { PUBLIC_COURSES } from "@/constant/public-site.constant";
import type { PublicCourse } from "@/types/public-site/public-site.type";

const iconMap: Record<PublicCourse["icon"], typeof Languages> = {
  languages: Languages,
  "message-circle": MessageCircle,
  "briefcase-business": BriefcaseBusiness,
  "mic-2": Mic2,
};

export function CoursePreviewSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            description="Programs are designed around practical language use, clear progression and confidence-building practice."
            eyebrow="Learning programs"
            title="Courses built for real progress"
          />
          <Link
            className="inline-flex w-fit items-center gap-2 text-sm font-black text-[#087448] underline-offset-4 hover:underline"
            href="/courses"
          >
            See all course details
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PUBLIC_COURSES.map((course) => {
            const Icon = iconMap[course.icon];

            return (
              <article
                className="rounded-[1.75rem] border border-[#E0E8E3] bg-white p-6 shadow-[0_12px_35px_rgba(22,60,39,0.06)]"
                key={course.title}
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-[#17211D] text-white">
                  <Icon aria-hidden="true" size={23} />
                </span>
                <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.15em] text-[#0A7C58]">
                  {course.level}
                </p>
                <h3 className="mt-2 text-xl font-black tracking-[-0.03em] text-[#17211D]">
                  {course.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#647168]">
                  {course.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
