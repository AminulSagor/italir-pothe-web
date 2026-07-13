import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Languages,
} from "lucide-react";

import { PUBLIC_SITE_CONFIG } from "@/constant/public-site.constant";

export function BookSection() {
  return (
    <section className="bg-[#17211D] py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="relative mx-auto w-full max-w-[430px]">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-[#34D399]/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-4 shadow-2xl">
            <div className="relative aspect-[0.73/1] overflow-hidden rounded-[1.4rem] bg-white">
              <Image
                alt="Italir Pothe Italian language learning book cover"
                className="object-cover"
                fill
                sizes="(max-width: 640px) 90vw, 430px"
                src="/images/italir-pothe-book-cover.png"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#8FE0B1]">
            Italir Pothe books
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Continue learning with our printed guide
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            “গ্রামার সহ ইতালিয়ান ভাষা শেখা” supports learners with Bangla
            pronunciation and step-by-step guidance for studying Italian.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.08] p-4">
              <Languages
                aria-hidden="true"
                className="text-[#8FE0B1]"
                size={22}
              />
              <span className="font-bold">Bangla-friendly explanations</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.08] p-4">
              <BookOpenCheck
                aria-hidden="true"
                className="text-[#8FE0B1]"
                size={22}
              />
              <span className="font-bold">Grammar and guided learning</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#75FF33] px-6 font-black text-[#17211D] transition hover:bg-[#8CFF58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#17211D]"
              href={PUBLIC_SITE_CONFIG.luluBookUrl}
              rel="noreferrer"
              target="_blank"
            >
              Buy on Lulu
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              href="/books"
            >
              View book details
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
