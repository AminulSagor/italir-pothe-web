import type { Metadata } from "next";
import Link from "next/link";

import { supportEmail } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Account Deletion | Italir Pothe",
  description: "Request deletion of an Italir Pothe account and associated personal data.",
};

const deletionMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
  "Italir Pothe account deletion request",
)}&body=${encodeURIComponent(
  "Please delete my Italir Pothe account.\n\nFull name:\nRegistered email or phone:\nReason (optional):",
)}`;

export default function AccountDeletionPage() {
  return (
    <main className="min-h-screen bg-[#f5f7f4] px-4 py-8 text-[#25302b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#0a7c58]">
          <Link className="rounded-full bg-white px-4 py-2 shadow-sm" href="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="rounded-full bg-white px-4 py-2 shadow-sm" href="/terms-and-conditions">
            Terms &amp; Conditions
          </Link>
        </nav>

        <header className="rounded-[2rem] border border-[#cdebc1] bg-[#eaf8e4] p-7 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#267a05]">Italir Pothe</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Delete your account</h1>
          <p className="mt-5 text-base leading-7 text-[#3f4843] sm:text-lg">
            You can delete your account directly in the app or submit a request here if you no longer have access to it.
          </p>
        </header>

        <section className="mt-6 rounded-[1.75rem] border border-[#e2e7e3] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black text-[#1f6b00]">Delete inside the app</h2>
          <ol className="mt-4 space-y-3 pl-5 text-[#444b47]">
            <li className="list-decimal leading-7">Open Italir Pothe and sign in.</li>
            <li className="list-decimal leading-7">Open Settings.</li>
            <li className="list-decimal leading-7">Under Privacy &amp; Legal, choose Delete Account.</li>
            <li className="list-decimal leading-7">Enter your account full name and confirm.</li>
          </ol>
        </section>

        <section className="mt-5 rounded-[1.75rem] border border-[#e2e7e3] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black text-[#1f6b00]">Request deletion without the app</h2>
          <p className="mt-4 leading-7 text-[#444b47]">
            Send the request from your registered email address when possible. Include your full name and registered email address or phone number. We may ask for additional verification to protect your account.
          </p>
          <a
            className="mt-6 inline-flex rounded-full bg-[#267a05] px-6 py-3 font-bold text-white shadow-sm hover:bg-[#1f6b00]"
            href={deletionMailto}
          >
            Email account-deletion request
          </a>
          <p className="mt-4 text-sm text-[#657069]">Support email: {supportEmail}</p>
        </section>

        <section className="mt-5 rounded-[1.75rem] border border-[#e2e7e3] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black text-[#1f6b00]">What happens to your data</h2>
          <p className="mt-4 leading-7 text-[#444b47]">
            We disable account access and remove or anonymize direct profile identifiers. Associated personal data is deleted or de-identified through our retention process. We may retain limited transaction, fraud-prevention, security, accounting, or legal records when required, and protected backups may take additional time to expire.
          </p>
          <p className="mt-4 leading-7 text-[#444b47]">
            We aim to complete verified requests within 30 days unless applicable law permits or requires a different period.
          </p>
        </section>

        <footer className="py-10 text-center text-sm text-[#657069]">
          © 2026 Italir Pothe Educational Systems. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
