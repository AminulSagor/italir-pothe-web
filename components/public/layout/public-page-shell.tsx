import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public/layout/public-footer";
import { PublicNavbar } from "@/components/public/layout/public-navbar";
import { PublicToaster } from "@/components/public/shared/public-toaster";

interface PublicPageShellProps {
  children: ReactNode;
}

export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div className="min-h-screen bg-white text-[#17211D]">
      <PublicToaster />

      <a
        className="fixed left-4 top-3 z-[200] -translate-y-24 rounded-full bg-[#006B3F] px-5 py-3 text-sm font-bold text-white transition focus:translate-y-0"
        href="#main-content"
      >
        Skip to main content
      </a>

      <PublicNavbar />

      <main id="main-content">{children}</main>

      <PublicFooter />
    </div>
  );
}
