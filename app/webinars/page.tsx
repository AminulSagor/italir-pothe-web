import type { Metadata } from "next";
import { CircleHelp, MessagesSquare, Presentation, Video } from "lucide-react";

import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { DownloadAppButton } from "@/components/public/shared/download-app-button";
import { PageHero } from "@/components/public/shared/page-hero";
import { WEBINAR_CATEGORIES } from "@/constant/public-site.constant";
import type { WebinarCategory } from "@/types/public-site/public-site.type";

export const metadata: Metadata = {
  title: "Webinars",
  description:
    "Learn about upcoming Italir Pothe language workshops, career discussions and live question sessions.",
};

const iconMap: Record<WebinarCategory["icon"], typeof Presentation> = {
  presentation: Presentation,
  "messages-square": MessagesSquare,
  "circle-help": CircleHelp,
};

export default function WebinarsPage() {
  return (
    <PublicPageShell>
      <PageHero
        actions={<DownloadAppButton label="App Coming Soon" size="lg" />}
        description="Interactive online sessions for practical language learning, career preparation and direct questions."
        eyebrow="Live learning experiences"
        title="Learn together through focused webinars"
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {WEBINAR_CATEGORIES.map((category) => {
              const Icon = iconMap[category.icon];

              return (
                <article
                  className="rounded-[1.75rem] border border-[#DCE7E0] bg-[#FBFDFC] p-7"
                  key={category.title}
                >
                  <span className="grid size-[3.25rem] place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
                    <Icon aria-hidden="true" size={25} />
                  </span>
                  <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-[#17211D]">
                    {category.title}
                  </h2>
                  <p className="mt-3 leading-7 text-[#627067]">
                    {category.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-12 rounded-[2rem] bg-[#17211D] p-8 text-white sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="flex max-w-2xl items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#8FE0B1]">
                <Video aria-hidden="true" size={24} />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-[-0.04em]">
                  Webinar schedule coming soon
                </h2>
                <p className="mt-3 leading-7 text-white/65">
                  Dates, topics and joining instructions will be announced
                  through official Italir Pothe channels and the mobile app.
                </p>
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <DownloadAppButton label="View App Notice" variant="light" />
            </div>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
