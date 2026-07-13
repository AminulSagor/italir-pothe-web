import type { Metadata } from "next";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  Megaphone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { ContactForm } from "@/components/public/contact/contact-form";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { PageHero } from "@/components/public/shared/page-hero";
import { PUBLIC_SITE_CONFIG } from "@/constant/public-site.constant";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Italir Pothe for course, book, webinar, certificate or business enquiries.",
};

const enquiryTypes = [
  {
    title: "Courses & app",
    description: "Questions about learning programs or the upcoming app.",
    icon: Mail,
  },
  {
    title: "Books",
    description: "Questions about the printed learning guide and Lulu orders.",
    icon: BookOpen,
  },
  {
    title: "Certificates",
    description: "Help with certificate IDs and public verification.",
    icon: ShieldCheck,
  },
] as const;

const socialLinks = [
  {
    title: "Facebook Page",
    description:
      "Follow our official page for announcements, learning content and upcoming events.",
    href: PUBLIC_SITE_CONFIG.facebookPageUrl,
    linkLabel: "Visit Facebook Page",
    icon: Megaphone,
  },
  {
    title: "Facebook Community",
    description:
      "Join other learners to ask questions, discuss lessons and receive community updates.",
    href: PUBLIC_SITE_CONFIG.facebookGroupUrl,
    linkLabel: "Join Facebook Group",
    icon: UsersRound,
  },
] as const;

export default function ContactPage() {
  return (
    <PublicPageShell>
      <PageHero
        description="Contact us about learning programs, books, webinars, certificates or business enquiries."
        eyebrow="Contact Italir Pothe"
        title="How can we help?"
      />

      <section className="bg-[#F4FAF5] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <div className="rounded-[2rem] bg-[#17211D] p-7 text-white sm:p-8">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8FE0B1]">
                Direct email
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                Talk to our team
              </h2>

              <p className="mt-4 leading-7 text-white/65">
                Send your enquiry and include enough detail so we can respond
                clearly.
              </p>

              <a
                href={`mailto:${PUBLIC_SITE_CONFIG.contactEmail}`}
                className="mt-6 inline-flex break-all text-lg font-black text-[#8FE0B1] underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FE0B1] focus-visible:ring-offset-4 focus-visible:ring-offset-[#17211D]"
              >
                {PUBLIC_SITE_CONFIG.contactEmail}
              </a>
            </div>

            <div className="mt-5 space-y-4">
              {enquiryTypes.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="flex gap-4 rounded-2xl border border-[#DCE7E0] bg-white p-5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
                    <Icon aria-hidden="true" size={21} />
                  </span>

                  <div>
                    <h3 className="font-black text-[#17211D]">{title}</h3>

                    <p className="mt-1 text-sm leading-6 text-[#657269]">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <ContactForm />
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#087448]">
              Connect with us
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#17211D] sm:text-4xl">
              Follow updates and join the community
            </h2>

            <p className="mt-4 leading-7 text-[#657269]">
              Follow our official Facebook page for announcements and join our
              learner group for discussions, questions and community support.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {socialLinks.map(
              ({
                title,
                description,
                href,
                linkLabel,
                icon: Icon,
              }) => (
                <article
                  key={title}
                  className="group rounded-[1.75rem] border border-[#DCE7E0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-7"
                >
                  <span className="grid size-12 place-items-center rounded-2xl bg-[#E4F7EB] text-[#087448]">
                    <Icon aria-hidden="true" size={23} />
                  </span>

                  <h3 className="mt-5 text-xl font-black text-[#17211D]">
                    {title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#657269]">
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
                      className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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