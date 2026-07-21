"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

import { IMAGE } from "@/constant/image.path";
import { adminNavigation } from "../../../constant/navigation";
import {
  formatUserRole,
  getAuthUser,
  removeAuthUser,
  type AuthUser,
} from "@/utils/auth_user_util";
import { removeToken } from "@/utils/cookies_util";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const isPathActive = (pathname: string, href?: string) => {
  if (!href || href === "#") {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);

  const [openMenus, setOpenMenus] = useState<string[]>([
    "Revenue & Analytics",
    "Final Exam Manager",
    "Reports & Moderation",
  ]);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  /*
   * Automatically open the parent menu when the current page
   * belongs to one of its child routes.
   *
   * Example:
   * /admin/reports-moderation/ai-reports
   * automatically opens "Reports & Moderation".
   */
  useEffect(() => {
    const activeParentTitles = adminNavigation.flatMap((group) =>
      group.items
        .filter((item) =>
          item.children?.some((child) => isPathActive(pathname, child.href)),
        )
        .map((item) => item.title),
    );

    if (activeParentTitles.length === 0) {
      return;
    }

    setOpenMenus((previousMenus) => {
      const nextMenus = new Set(previousMenus);

      activeParentTitles.forEach((title) => {
        nextMenus.add(title);
      });

      return Array.from(nextMenus);
    });
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus((previousMenus) =>
      previousMenus.includes(title)
        ? previousMenus.filter((item) => item !== title)
        : [...previousMenus, title],
    );
  };

  const handleLogout = () => {
    removeToken();
    removeAuthUser();
    onClose();
    router.replace("/auth");
  };

  const fullName = user?.fullName || "Admin";
  const role = formatUserRole(user?.role);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#00552E] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-6 py-6">
          <Image
            src={IMAGE.logo}
            width={25}
            height={100}
            alt="ItalirPothe logo"
          />

          <h1 className="font-bold">ItalirPothe</h1>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {adminNavigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 font-semibold uppercase text-white/50">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  const hasChildren = Boolean(
                    item.children && item.children.length > 0,
                  );

                  const isMenuOpen = openMenus.includes(item.title);

                  const isParentActive = isPathActive(pathname, item.href);

                  const isChildActive = Boolean(
                    item.children?.some((child) =>
                      isPathActive(pathname, child.href),
                    ),
                  );

                  const isActive = isParentActive || isChildActive;

                  if (hasChildren) {
                    return (
                      <div key={item.title}>
                        <div
                          className={`flex items-center justify-between rounded-2xl transition ${
                            isActive
                              ? "bg-[#75FF33] font-semibold text-[#00552E]"
                              : "text-white/85 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Link
                            href={item.href ?? "#"}
                            onClick={onClose}
                            className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2"
                          >
                            <Icon className="size-4 shrink-0" />

                            <span className="truncate">{item.title}</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => toggleMenu(item.title)}
                            aria-label={`Toggle ${item.title}`}
                            aria-expanded={isMenuOpen}
                            className="flex size-9 shrink-0 items-center justify-center rounded-xl transition hover:bg-black/10"
                          >
                            <ChevronDown
                              className={`size-4 transition-transform duration-200 ${
                                isMenuOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {isMenuOpen && (
                          <div className="ml-7 mt-1 space-y-1">
                            {item.children?.map((child) => {
                              const ChildIcon = child.icon;

                              const childIsActive = isPathActive(
                                pathname,
                                child.href,
                              );

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                                    childIsActive
                                      ? "bg-[#75FF33] font-semibold text-[#00552E]"
                                      : "text-white/75 hover:bg-white/10 hover:text-white"
                                  }`}
                                >
                                  {ChildIcon && (
                                    <ChildIcon className="size-4 shrink-0" />
                                  )}

                                  <span className="truncate">
                                    {child.title}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.title}
                      href={item.href ?? "#"}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-2 transition ${
                        isActive
                          ? "bg-[#75FF33] font-semibold text-[#00552E]"
                          : "text-white/85 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />

                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4">
          <div className="flex items-center justify-between rounded-2xl bg-white p-3 text-black">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={IMAGE.customer}
                  alt={fullName}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold">{fullName}</p>

                <p className="truncate text-sm text-black/60">{role}</p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Logout"
              onClick={handleLogout}
              className="rounded-xl p-2 transition hover:bg-red-50"
            >
              <LogOut className="size-5 text-red-500" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
