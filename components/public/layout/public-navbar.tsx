"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/public/shared/brand-logo";
import { DownloadAppButton } from "@/components/public/shared/download-app-button";
import { PUBLIC_NAVIGATION } from "@/constant/public-site.constant";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E1E9E4]/90 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {PUBLIC_NAVIGATION.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] ${
                  active
                    ? "bg-[#E8F5ED] text-[#087448]"
                    : "text-[#526058] hover:bg-[#F1F5F2] hover:text-[#17211D]"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <DownloadAppButton />
        </div>

        <button
          aria-expanded={isMenuOpen}
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className="grid size-11 place-items-center rounded-full border border-[#DCE6DF] bg-white text-[#25302B] transition hover:bg-[#F2F6F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? (
            <X aria-hidden="true" size={21} />
          ) : (
            <Menu aria-hidden="true" size={21} />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[76px] z-50 overflow-y-auto border-t border-[#E1E9E4] bg-white px-4 py-6 lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-2xl flex-col gap-2"
          >
            {PUBLIC_NAVIGATION.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`rounded-2xl px-5 py-4 text-base font-bold transition ${
                    active
                      ? "bg-[#E8F5ED] text-[#087448]"
                      : "text-[#334139] hover:bg-[#F2F6F3]"
                  }`}
                  href={item.href}
                  key={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <DownloadAppButton
              className="mt-4 w-full"
              onPress={() => setIsMenuOpen(false)}
              size="lg"
            />
          </nav>
        </div>
      )}
    </header>
  );
}
