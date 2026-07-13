import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  MessagesSquare,
  Trophy,
} from "lucide-react";

import { SectionHeading } from "@/components/public/shared/section-heading";
import { PUBLIC_FEATURES } from "@/constant/public-site.constant";
import type { PublicFeature } from "@/types/public-site/public-site.type";

const iconMap: Record<PublicFeature["icon"], typeof BookOpen> = {
  "book-open": BookOpen,
  messages: MessagesSquare,
  briefcase: BriefcaseBusiness,
  "file-text": FileText,
  "badge-check": BadgeCheck,
  trophy: Trophy,
};

export function FeatureSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          description="Italir Pothe combines language learning, professional preparation and measurable progress in one focused experience."
          eyebrow="One complete platform"
          title="Everything you need to learn, prepare and grow"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PUBLIC_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon];

            return (
              <article
                className="group rounded-[1.75rem] border border-[#DFE8E2] bg-[#FBFDFC] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#BBD7C5] hover:shadow-[0_18px_50px_rgba(22,60,39,0.10)] sm:p-7"
                key={feature.title}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448] transition group-hover:bg-[#006B3F] group-hover:text-white">
                    <Icon aria-hidden="true" size={23} />
                  </span>
                  <span className="text-sm font-black text-[#C0CCC4]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-black tracking-[-0.03em] text-[#1B2821]">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-[#627067]">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
