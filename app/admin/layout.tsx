"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "../../components/layout/sidebar";
import Navbar from "../../components/layout/navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  const isFullFocusPage =
    pathname.includes("/deal-configurator") ||
    pathname.includes("/add-payout") ||
    pathname.includes("/reports-moderation/resolve");

  const isSidebarOnlyPage =
    pathname.includes("/caf-service") ||
    pathname.includes("/influencer-hub") ||
    pathname.includes("/reports-moderation");

  const hasCustomTopbar = pathname.includes(
    "/caf-service/permesso-di-soggiorno/edit"
  );

  if (isFullFocusPage) {
    return (
      <div className="min-h-screen bg-[#F5FAF3] p-6 text-black">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FAF3] text-black">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          isCollapsed={isDesktopSidebarCollapsed}
          onClose={() => setIsSidebarOpen(false)}
          onToggleCollapse={() =>
            setIsDesktopSidebarCollapsed((prev) => !prev)
          }
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {!isSidebarOnlyPage && (
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          )}

          {isSidebarOnlyPage && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="fixed left-4 top-4 z-30 flex size-10 items-center justify-center rounded-full bg-[#00552E] text-white shadow-lg md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>
          )}

          <main
            className={
              isSidebarOnlyPage
                ? hasCustomTopbar
                  ? "flex-1"
                  : "flex flex-1 justify-center px-6 py-8"
                : "flex flex-1 justify-center p-5 lg:p-6"
            }
          >
            {hasCustomTopbar ? (
              children
            ) : (
              <div className="w-full max-w-[1400px]">{children}</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;