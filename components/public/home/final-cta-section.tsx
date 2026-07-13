import { BookOpen, Smartphone } from "lucide-react";
import Link from "next/link";

import { DownloadAppButton } from "@/components/public/shared/download-app-button";

export function FinalCtaSection() {
  return (
    <section className="bg-[#F4FAF5] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#E2F5E9] text-[#087448]">
          <Smartphone aria-hidden="true" size={27} />
        </span>
        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black tracking-[-0.05em] text-[#17211D] sm:text-5xl">
          Start your Italian learning journey with Italir Pothe
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5F6C65]">
          The mobile app is coming soon. In the meantime, explore our programs
          and order the printed learning guide from Lulu.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <DownloadAppButton label="App Coming Soon" size="lg" />
          <Link
            className="inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full border border-[#BFD3C6] bg-white px-7 text-base font-bold text-[#25302B] transition hover:border-[#7CAC8D] hover:bg-[#EEF6F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-2"
            href="/books"
          >
            <BookOpen aria-hidden="true" size={18} />
            Explore the Book
          </Link>
        </div>
      </div>
    </section>
  );
}
