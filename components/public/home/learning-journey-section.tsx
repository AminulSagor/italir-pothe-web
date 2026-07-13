import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/public/shared/section-heading";

const journey = [
  {
    step: "01",
    title: "Start with your level",
    description:
      "Follow structured lessons designed to build a clear foundation.",
  },
  {
    step: "02",
    title: "Practice real Italian",
    description:
      "Use vocabulary, grammar, speaking and everyday situation exercises.",
  },
  {
    step: "03",
    title: "Complete assessments",
    description:
      "Measure progress through quizzes, final exams and guided evaluation.",
  },
  {
    step: "04",
    title: "Earn your certificate",
    description:
      "Receive a certificate that can be verified through the public website.",
  },
];

export function LearningJourneySection() {
  return (
    <section className="bg-[#F3F8F4] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <SectionHeading
            description="A clear path keeps learning practical and progress visible from the first lesson to certification."
            eyebrow="How it works"
            title="A guided learning journey"
          />

          <Link
            href="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0A7C58] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#086747] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34D399] focus-visible:ring-offset-2"
          >
            View learning programs
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {journey.map((item) => (
            <article
              className="relative overflow-hidden rounded-[1.75rem] border border-[#DBE7DF] bg-white p-6 shadow-sm"
              key={item.step}
            >
              <span className="absolute right-5 top-4 text-4xl font-black text-[#ECF2EE]">
                {item.step}
              </span>
              <CheckCircle2
                aria-hidden="true"
                className="text-[#0A7C58]"
                size={26}
              />
              <h3 className="relative mt-8 text-xl font-black tracking-[-0.03em] text-[#17211D]">
                {item.title}
              </h3>
              <p className="relative mt-3 leading-7 text-[#627067]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
