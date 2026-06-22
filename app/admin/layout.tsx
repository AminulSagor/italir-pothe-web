"use client";

import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

import Sidebar from "../../components/layout/sidebar/sidebar";
import Navbar from "../../components/layout/navbar/navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminPageFallback = () => {
  return (
    <div className="flex min-h-[420px] items-center justify-center text-sm text-[#66736B]">
      Loading...
    </div>
  );
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const isFullFocusPage =
    pathname.includes("/deal-configurator") ||
    pathname.includes("/add-payout") ||
    pathname.includes(
      "/reports-moderation/resolve",
    );

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "14px",
            background: "#ffffff",
            color: "#1f2937",
          },
          success: {
            duration: 4000,
          },
          error: {
            duration: 5000,
          },
        }}
      />

      {isFullFocusPage ? (
        <div className="min-h-screen bg-[#F5FAF3] p-6 text-black">
          <Suspense
            fallback={<AdminPageFallback />}
          >
            {children}
          </Suspense>
        </div>
      ) : (
        <div className="h-screen overflow-hidden bg-[#F5FAF3] text-black">
          <div className="flex h-full">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() =>
                setIsSidebarOpen(false)
              }
            />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <Navbar
                onMenuClick={() =>
                  setIsSidebarOpen(true)
                }
              />

              <main className="flex-1 overflow-y-auto p-4 text-black lg:p-8">
                <Suspense
                  fallback={
                    <AdminPageFallback />
                  }
                >
                  {children}
                </Suspense>
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminLayout;
