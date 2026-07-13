import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  UsersRound,
} from "lucide-react";

import { BrandLogo } from "@/components/public/shared/brand-logo";
import {
  PUBLIC_NAVIGATION,
  PUBLIC_SITE_CONFIG,
} from "@/constant/public-site.constant";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Account Deletion", href: "/account-deletion" },
] as const;

interface FacebookIconProps {
  className?: string;
  size?: number;
}

function FacebookIcon({
  className,
  size = 19,
}: FacebookIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.25 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.62.77-1.62 1.56v1.9h2.76l-.44 2.91h-2.32V22C18.34 21.25 22 17.08 22 12.06Z" />
    </svg>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-[#DCE7E0] bg-[#111A16] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr] lg:px-8 lg:py-16">
        <div className="max-w-sm">
          <div className="inline-flex rounded-[1.4rem] bg-white px-4 py-3">
            <BrandLogo />
          </div>

          <p className="mt-6 text-sm leading-7 text-white/65">
            {PUBLIC_SITE_CONFIG.shortDescription}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8FE0B1]">
            Explore
          </h2>

          <ul className="mt-5 space-y-3">
            {PUBLIC_NAVIGATION.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8FE0B1]">
            Information
          </h2>

          <ul className="mt-5 space-y-3">
            {[...PUBLIC_NAVIGATION.slice(5), ...legalLinks].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8FE0B1]">
            Books, community &amp; support
          </h2>

          <div className="mt-5 space-y-3">
            <a
              href={PUBLIC_SITE_CONFIG.luluBookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <BookOpen
                aria-hidden="true"
                className="shrink-0 text-[#8FE0B1]"
                size={19}
              />

              <span className="flex-1">Buy our book on Lulu</span>

              <ArrowUpRight aria-hidden="true" size={17} />
            </a>

            <a
              href={PUBLIC_SITE_CONFIG.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit the Italir Pothe Facebook page"
              className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <FacebookIcon
  className="shrink-0 text-[#8FE0B1]"
  size={19}
/>

              <span className="flex-1">Follow our Facebook page</span>

              <ArrowUpRight aria-hidden="true" size={17} />
            </a>

            <a
              href={PUBLIC_SITE_CONFIG.facebookGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join the Italir Pothe Facebook community"
              className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <UsersRound
                aria-hidden="true"
                className="shrink-0 text-[#8FE0B1]"
                size={19}
              />

              <span className="flex-1">Join our Facebook community</span>

              <ArrowUpRight aria-hidden="true" size={17} />
            </a>

            <a
              href={`mailto:${PUBLIC_SITE_CONFIG.contactEmail}`}
              className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              <Mail
                aria-hidden="true"
                className="shrink-0 text-[#8FE0B1]"
                size={19}
              />

              <span className="min-w-0 flex-1 truncate">
                {PUBLIC_SITE_CONFIG.contactEmail}
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} Italir Pothe. All rights reserved.
          </p>

          <p>Practical Italian learning with Bangla-friendly guidance.</p>
        </div>
      </div>
    </footer>
  );
}