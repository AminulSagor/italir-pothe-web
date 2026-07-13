import type { Metadata } from "next";
import {
  ArrowUpRight,
  BookOpenText,
  Compass,
  GraduationCap,
  HeartHandshake,
  Megaphone,
  UsersRound,
} from "lucide-react";

import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { DownloadAppButton } from "@/components/public/shared/download-app-button";
import { PageHero } from "@/components/public/shared/page-hero";
import { PUBLIC_SITE_CONFIG } from "@/constant/public-site.constant";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Italir Pothe and its practical approach to Italian language and career learning.",
};

const values = [
  {
    title: "Practical learning",
    description:
      "Focus on language and skills learners can apply in real situations.",
    icon: Compass,
  },
  {
    title: "Clear guidance",
    description:
      "Make complex topics easier through structured, step-by-step learning.",
    icon: BookOpenText,
  },
  {
    title: "Measurable progress",
    description:
      "Use activities, examinations and certificates to make progress visible.",
    icon: GraduationCap,
  },
  {
    title: "Learner support",
    description:
      "Build a learning experience that is approachable, motivating and useful.",
    icon: HeartHandshake,
  },
] as const;

const communityLinks = [
  {
    title: "Follow our Facebook page",
    description:
      "Receive official announcements, learning content, book updates and upcoming webinar information.",
    href: PUBLIC_SITE_CONFIG.facebookPageUrl,
    linkLabel: "Visit Facebook Page",
    icon: Megaphone,
  },
  {
    title: "Join our learning community",
    description:
      "Connect with other learners, ask questions, discuss lessons and receive community support.",
    href: PUBLIC_SITE_CONFIG.facebookGroupUrl,
    linkLabel: "Join Facebook Group",
    icon: UsersRound,
  },
] as const;

export default function AboutPage() {
  return (
    <PublicPageShell>
      <PageHero
        description="Italir Pothe is built to make Italian learning more practical, understandable and connected to real personal and professional goals."
        eyebrow="About Italir Pothe"
        title="A clearer path to language confidence"
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0A7C58]">
              Our purpose
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#17211D] sm:text-4xl">
              Help learners move from understanding to confident action
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#5F6C65]">
              Italir Pothe brings together Italian courses, everyday language
              practice, career preparation, CV support, live webinars,
              assessments and verified certificates.
            </p>

            <p className="mt-4 leading-8 text-[#627067]">
              Printed learning materials extend that experience beyond the app
              and provide learners with another practical way to study
              consistently.
            </p>

            <div className="mt-8">
              <DownloadAppButton label="App Coming Soon" size="lg" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {values.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-[1.75rem] border border-[#DCE7E0] bg-[#FBFDFC] p-6"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
                  <Icon aria-hidden="true" size={23} />
                </span>

                <h3 className="mt-5 text-xl font-black tracking-[-0.03em] text-[#17211D]">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-[#627067]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4FAF5] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0A7C58]">
              Our community
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#17211D] sm:text-4xl">
              Learn together and stay connected
            </h2>

            <p className="mt-5 text-lg leading-8 text-[#627067]">
              Follow our official page for Italir Pothe updates and join our
              Facebook group to connect with other Italian-language learners.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
            {communityLinks.map(
              ({
                title,
                description,
                href,
                linkLabel,
                icon: Icon,
              }) => (
                <article
                  key={title}
                  className="group rounded-[1.75rem] border border-[#DCE7E0] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
                    <Icon aria-hidden="true" size={23} />
                  </span>

                  <h3 className="mt-5 text-xl font-black tracking-[-0.03em] text-[#17211D]">
                    {title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#627067]">
                    {description}
                  </p>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 font-bold text-[#087448] underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087448] focus-visible:ring-offset-4"
                  >
                    {linkLabel}

                    <ArrowUpRight
                      aria-hidden="true"
                      className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      size={18}
                    />
                  </a>
                </article>
              ),
            )}
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}