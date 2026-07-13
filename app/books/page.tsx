import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, BookOpenCheck, Check, Languages } from "lucide-react";

import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { PageHero } from "@/components/public/shared/page-hero";
import { PUBLIC_SITE_CONFIG } from "@/constant/public-site.constant";

export const metadata: Metadata = {
  title: "Books",
  description:
    "Discover the Italir Pothe Italian language learning book available through Lulu.",
};

export default function BooksPage() {
  return (
    <PublicPageShell>
      <PageHero
        description="Study Italian with a printed guide created around Bangla pronunciation, grammar and step-by-step learning."
        eyebrow="Printed learning resources"
        title="Learn beyond the screen with Italir Pothe books"
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-[#DCE7E0] bg-[#F4F8F5] p-4 shadow-[0_22px_60px_rgba(24,70,44,0.12)]">
            <div className="relative aspect-[0.73/1] overflow-hidden rounded-[1.4rem] bg-white">
              <Image
                alt="Cover of the Italir Pothe Italian language learning book"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 640px) 90vw, 430px"
                src="/images/italir-pothe-book-cover.png"
              />
            </div>
          </div>

          <article>
            <span className="inline-flex rounded-full bg-[#E7F5EC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#087448]">
              Available through Lulu
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-[#17211D] sm:text-5xl">
              গ্রামার সহ ইতালিয়ান ভাষা শেখা
            </h2>
            <p className="mt-5 text-xl font-bold text-[#3C4A42]">
              Italir Pothe
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#627067]">
              A pronunciation and step-by-step learning guide for learners who
              want to study Italian with Bangla-friendly support.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#DCE7E0] bg-[#FBFDFC] p-5">
                <Languages
                  aria-hidden="true"
                  className="text-[#087448]"
                  size={25}
                />
                <h3 className="mt-4 font-black text-[#17211D]">
                  Bangla-friendly support
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#657269]">
                  Designed to make pronunciation and learning easier to follow.
                </p>
              </div>
              <div className="rounded-2xl border border-[#DCE7E0] bg-[#FBFDFC] p-5">
                <BookOpenCheck
                  aria-hidden="true"
                  className="text-[#087448]"
                  size={25}
                />
                <h3 className="mt-4 font-black text-[#17211D]">
                  Step-by-step learning
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#657269]">
                  Use the printed guide alongside regular language practice.
                </p>
              </div>
            </div>

            <ul className="mt-7 space-y-3">
              {[
                "Grammar-focused learning",
                "Pronunciation guidance",
                "Suitable for self-study",
              ].map((item) => (
                <li
                  className="flex items-center gap-3 font-semibold text-[#445149]"
                  key={item}
                >
                  <span className="grid size-6 place-items-center rounded-full bg-[#DDF3E8] text-[#087448]">
                    <Check aria-hidden="true" size={15} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <a
              className="mt-8 inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#006B3F] px-7 font-black text-white transition hover:bg-[#005832] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2"
              href={PUBLIC_SITE_CONFIG.luluBookUrl}
              rel="noreferrer"
              target="_blank"
            >
              Buy on Lulu
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </article>
        </div>
      </section>
    </PublicPageShell>
  );
}
