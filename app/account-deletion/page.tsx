import type { Metadata } from "next";
import Link from "next/link";

import { supportEmail } from "@/components/legal/legal-content";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";

export const metadata: Metadata = {
  title: "Account Deletion",
  description:
    "Request deletion of an Italir Pothe account and associated personal data.",
};

const deletionMailto = `mailto:${supportEmail}?subject=${encodeURIComponent(
  "Italir Pothe account deletion request",
)}&body=${encodeURIComponent(
  "Please delete my Italir Pothe account.\n\nFull name:\nRegistered email or phone:\nReason (optional):",
)}`;

export default function AccountDeletionPage() {
  return (
    <PublicPageShell>
      <section className="bg-[#F4FAF5] px-4 py-12 text-[#25302B] sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <nav
            aria-label="Legal pages"
            className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#0A7C58]"
          >
            <Link
              href="/privacy-policy"
              className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#DFE8E2] transition hover:bg-[#F2F8F4]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#DFE8E2] transition hover:bg-[#F2F8F4]"
            >
              Terms &amp; Conditions
            </Link>
          </nav>

          <header className="rounded-[2rem] border border-[#CDE5D6] bg-[#EAF8EE] p-7 shadow-sm sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0A7C58]">
              Italir Pothe
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
              Delete your account
            </h1>

            <p className="mt-5 text-base leading-7 text-[#3F4843] sm:text-lg">
              You can delete your account directly from the Italir Pothe app or
              submit a deletion request by email if you can no longer access
              your account.
            </p>
          </header>

          <section className="mt-6 rounded-[1.75rem] border border-[#E2E7E3] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black text-[#075F3A]">
              Delete your account in the app
            </h2>

            <ol className="mt-4 space-y-3 pl-5 text-[#444B47]">
              <li className="list-decimal leading-7">
                Open the Italir Pothe app and sign in.
              </li>

              <li className="list-decimal leading-7">
                Open your account settings.
              </li>

              <li className="list-decimal leading-7">
                Select Privacy &amp; Legal.
              </li>

              <li className="list-decimal leading-7">
                Select Delete Account.
              </li>

              <li className="list-decimal leading-7">
                Enter your full name and confirm the deletion request.
              </li>
            </ol>
          </section>

          <section className="mt-5 rounded-[1.75rem] border border-[#E2E7E3] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black text-[#075F3A]">
              Request deletion without the app
            </h2>

            <p className="mt-4 leading-7 text-[#444B47]">
              Send your request from the email address registered with your
              account whenever possible. Include your full name and registered
              email address or phone number. We may request additional
              information to verify that you own the account.
            </p>

            <a
              href={deletionMailto}
              className="mt-6 inline-flex rounded-full bg-[#006B3F] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#005832] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006B3F] focus-visible:ring-offset-2"
            >
              Email account-deletion request
            </a>

            <p className="mt-4 break-all text-sm text-[#657069]">
              Support email:{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-semibold text-[#0A7C58] underline-offset-4 hover:underline"
              >
                {supportEmail}
              </a>
            </p>
          </section>

          <section className="mt-5 rounded-[1.75rem] border border-[#E2E7E3] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black text-[#075F3A]">
              What happens after deletion
            </h2>

            <p className="mt-4 leading-7 text-[#444B47]">
              Your account access will be disabled, and direct profile
              identifiers will be removed, deleted or anonymized through our
              data-retention process.
            </p>

            <p className="mt-4 leading-7 text-[#444B47]">
              Some limited information may be retained when required for legal,
              accounting, transaction, fraud-prevention, security or
              dispute-resolution purposes. Protected backup copies may also
              require additional time to expire.
            </p>

            <p className="mt-4 leading-7 text-[#444B47]">
              We aim to complete verified deletion requests within 30 days,
              unless applicable law permits or requires a different period.
            </p>
          </section>
        </div>
      </section>
    </PublicPageShell>
  );
}