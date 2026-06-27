import Link from "next/link";

import type { LegalDocument } from "./legal-content";

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <main className="min-h-screen bg-[#f5f7f4] px-4 py-8 text-[#25302b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#0a7c58]">
          <Link className="rounded-full bg-white px-4 py-2 shadow-sm" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="rounded-full bg-white px-4 py-2 shadow-sm" href="/terms-and-conditions">
            Terms &amp; Conditions
          </Link>
          <Link className="rounded-full bg-white px-4 py-2 shadow-sm" href="/account-deletion">
            Account Deletion
          </Link>
        </nav>

        <header className="rounded-[2rem] border border-[#cdebc1] bg-[#eaf8e4] p-7 shadow-sm sm:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#267a05]">
            Italir Pothe
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{document.title}</h1>
          <p className="mt-4 font-bold text-[#267a05]">{document.effectiveDate}</p>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#3f4843] sm:text-lg">
            {document.introduction}
          </p>
        </header>

        <div className="mt-6 space-y-5">
          {document.sections.map((section) => (
            <section
              className="rounded-[1.75rem] border border-[#e2e7e3] bg-white p-6 shadow-sm sm:p-8"
              key={section.title}
            >
              <h2 className="text-xl font-black text-[#1f6b00] sm:text-2xl">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p className="mt-4 leading-7 text-[#444b47]" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-4 space-y-3 pl-5 text-[#444b47]">
                  {section.bullets.map((bullet) => (
                    <li className="list-disc leading-7 marker:text-[#267a05]" key={bullet}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="py-10 text-center text-sm text-[#657069]">
          © 2026 Italir Pothe Educational Systems. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
