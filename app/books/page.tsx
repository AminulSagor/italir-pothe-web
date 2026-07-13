import type { Metadata } from "next";
import Image from "next/image";
import { BookOpenCheck, Check, Languages, Sparkles } from "lucide-react";

import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { PageHero } from "@/components/public/shared/page-hero";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Discover Italir Pothe printed resources for learning Italian with Bangla-friendly guidance.",
};

const bookBenefits = [
  "Grammar-focused learning",
  "Pronunciation guidance",
  "Suitable for self-study",
] as const;

export default function BooksPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Printed learning resources"
        title="Learn beyond the screen with Italir Pothe books"
        description="Study Italian with a printed guide created around Bangla pronunciation, grammar and step-by-step learning."
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 lg:px-8">
          <div className="mx-auto w-full max-w-[420px] lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[2rem] border border-[#DCE7E0] bg-[#F4F8F5] p-4 shadow-[0_22px_60px_rgba(24,70,44,0.12)]">
              <div className="relative aspect-[0.73/1] overflow-hidden rounded-[1.4rem] bg-white">
                <Image
                  fill
                  priority
                  alt="Cover of the Italir Pothe Italian language learning book"
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 420px, 38vw"
                  src="/images/italir-pothe-book-cover.png"
                />
              </div>
            </div>
          </div>

          <article className="min-w-0 lg:py-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF8EE] px-4 py-2 text-sm font-bold text-[#087448]">
              <Sparkles aria-hidden="true" size={16} />
              Bangla-friendly Italian learning
            </div>

            <h2 className="mt-5 text-balance text-4xl font-black leading-[1.12] tracking-[-0.05em] text-[#17211D] sm:text-5xl">
              ইতালিয়ান ভাষা সহজে পাঠ
            </h2>

            <p className="mt-3 text-xl font-bold text-[#3C4A42]">
              Italir Pothe
            </p>

            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-[#627067]">
              A pronunciation and step-by-step learning guide for learners who
              want to study Italian with clear Bangla-friendly support.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <article className="h-full rounded-[1.5rem] border border-[#DCE7E0] bg-[#FBFDFC] p-5">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
                  <Languages aria-hidden="true" size={23} />
                </span>

                <h3 className="mt-4 text-lg font-black text-[#17211D]">
                  Bangla-friendly support
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#657269]">
                  Designed to make Italian pronunciation, vocabulary and
                  sentence structure easier to understand.
                </p>
              </article>

              <article className="h-full rounded-[1.5rem] border border-[#DCE7E0] bg-[#FBFDFC] p-5">
                <span className="grid size-11 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
                  <BookOpenCheck aria-hidden="true" size={23} />
                </span>

                <h3 className="mt-4 text-lg font-black text-[#17211D]">
                  Step-by-step learning
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#657269]">
                  Follow a structured printed guide alongside regular language
                  lessons and personal practice.
                </p>
              </article>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-[#DCE7E0] bg-[#F4FAF5] p-5 sm:p-6">
              <h3 className="font-black text-[#17211D]">
                What the guide supports
              </h3>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {bookBenefits.map((item) => (
                  <li
                    key={item}
                    className="flex min-w-0 items-center gap-3 font-semibold text-[#445149]"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#DDF3E8] text-[#087448]">
                      <Check aria-hidden="true" size={15} strokeWidth={3} />
                    </span>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>
    </PublicPageShell>
  );
}
