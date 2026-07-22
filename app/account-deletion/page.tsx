import type { Metadata } from "next";
import Link from "next/link";

import { AccountDeletionForm } from "@/components/public/account-deletion/account-deletion-form";
import { PublicPageShell } from "@/components/public/layout/public-page-shell";
import { supportEmail } from "@/components/legal/legal-content";

export const metadata: Metadata = {
  title: "Account Deletion",
  description:
    "Permanently delete an Italir Pothe account using email or phone verification.",
};

export default function AccountDeletionPage() {
  return (
    <PublicPageShell>
      <section className="bg-[#F4FAF5] px-4 py-12 text-[#25302B] sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav
            aria-label="Legal pages"
            className="mb-6 flex flex-wrap gap-3 text-sm font-semibold text-[#0A7C58]"
          >
            <Link
              className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#DFE8E2]"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>

            <Link
              className="rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-[#DFE8E2]"
              href="/terms-and-conditions"
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

            <p className="mt-5 max-w-3xl text-base leading-7 text-[#3F4843] sm:text-lg">
              Verify ownership using the email address or phone number
              registered with your account. After successful OTP verification,
              account deletion happens immediately.
            </p>
          </header>

          <div className="mt-7 grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-5">
              <section className="rounded-[1.75rem] border border-[#E2E7E3] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#075F3A]">
                  How web deletion works
                </h2>

                <ol className="mt-4 space-y-3 pl-5 text-[#444B47]">
                  <li className="list-decimal leading-7">
                    Enter your registered email or phone number.
                  </li>

                  <li className="list-decimal leading-7">
                    Receive a 6-digit verification code.
                  </li>

                  <li className="list-decimal leading-7">
                    Enter the code and type DELETE.
                  </li>

                  <li className="list-decimal leading-7">
                    Your account is deleted immediately.
                  </li>
                </ol>
              </section>

              <section className="rounded-[1.75rem] border border-[#E2E7E3] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#075F3A]">
                  What is removed
                </h2>

                <p className="mt-4 leading-7 text-[#444B47]">
                  Account access and direct profile identifiers are deleted,
                  removed or anonymized.
                </p>

                <p className="mt-4 leading-7 text-[#444B47]">
                  Limited transaction, security, legal or fraud-prevention
                  records may be retained where required.
                </p>
              </section>

              <section className="rounded-[1.75rem] border border-[#E2E7E3] bg-white p-6 shadow-sm">
                <h2 className="text-xl font-black text-[#075F3A]">
                  Need help?
                </h2>

                <p className="mt-4 leading-7 text-[#444B47]">
                  Contact{" "}
                  <a
                    className="font-bold text-[#0A7C58] hover:underline"
                    href={`mailto:${supportEmail}`}
                  >
                    {supportEmail}
                  </a>
                </p>
              </section>
            </div>

            <AccountDeletionForm />
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
