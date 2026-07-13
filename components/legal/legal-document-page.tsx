import Link from "next/link";

import type { LegalDocument } from "./legal-content";

const legalNavigation = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms-and-conditions",
  },
  {
    label: "Account Deletion",
    href: "/account-deletion",
  },
] as const;

interface LegalDocumentPageProps {
  document: LegalDocument;
}

function getSectionId(index: number): string {
  return `legal-section-${index + 1}`;
}

export function LegalDocumentPage({
  document,
}: LegalDocumentPageProps) {
  return (
    <section className="bg-surface-page px-4 py-12 text-dark-green sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Legal documents"
          className="mb-6 flex flex-wrap gap-3"
        >
          {legalNavigation.map((item) => {
            const isActive = item.label === document.title;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold shadow-sm ring-1 transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
                  isActive
                    ? "bg-secondary text-white ring-secondary"
                    : "bg-white text-secondary ring-border-soft hover:bg-surface-soft",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <header className="rounded-[2rem] border border-border-brand bg-surface-mint p-7 shadow-sm sm:p-10">
          <p className="text-label text-secondary">
            Italir Pothe
          </p>

          <h1 className="mt-3 text-balance text-3xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl">
            {document.title}
          </h1>

          <p className="mt-4 font-bold text-secondary">
            {document.effectiveDate}
          </p>

          <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-text-secondary sm:text-lg">
            {document.introduction}
          </p>
        </header>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <nav
              aria-label={`${document.title} contents`}
              className="rounded-[1.5rem] border border-border-soft bg-white p-5 shadow-sm"
            >
              <p className="text-label text-secondary">
                On this page
              </p>

              <ol className="mt-4 space-y-1">
                {document.sections.map((section, index) => (
                  <li key={section.title}>
                    <a
                      href={`#${getSectionId(index)}`}
                      className="block rounded-xl px-3 py-2 text-sm leading-5 text-text-secondary transition hover:bg-surface-soft hover:text-secondary"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="min-w-0 space-y-5">
            {document.sections.map((section, sectionIndex) => (
              <section
                key={section.title}
                id={getSectionId(sectionIndex)}
                className="scroll-mt-28 rounded-[1.75rem] border border-border-soft bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-balance text-xl font-black text-brand-700 sm:text-2xl">
                  {section.title}
                </h2>

                {section.paragraphs?.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${section.title}-paragraph-${paragraphIndex}`}
                    className="mt-4 text-pretty leading-7 text-text-secondary"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="mt-4 space-y-3 pl-5 text-text-secondary">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={`${section.title}-bullet-${bulletIndex}`}
                        className="list-disc leading-7 marker:text-secondary"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>
        </div>
      </div>
    </section>
  );
}