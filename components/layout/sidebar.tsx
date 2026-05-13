"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, LogOut, Menu } from "lucide-react";
import { adminNavigation } from "../../constant/navigation";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen shrink-0 flex-col bg-[#00552E] text-white transition-all duration-300 md:sticky md:top-0 md:translate-x-0 ${isCollapsed ? "w-20" : "w-72"
          } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex items-center py-6 ${isCollapsed ? "justify-center px-3" : "justify-between px-6"
            }`}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#75FF33] font-bold text-[#00552E]">
              I
            </div>

            {!isCollapsed && <h1 className="font-bold">ItalirPothe</h1>}
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden size-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/20 md:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {adminNavigation.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <p className="mb-3 px-3 font-semibold uppercase text-white/50">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === pathname ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href ?? ""));

                  if (item.children?.length) {
                    return (
                      <div key={item.title}>
                        <div
                          className={`flex items-center rounded-2xl px-3 py-2 text-white/85 ${isCollapsed ? "justify-center" : "justify-between"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="size-4" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>

                          {!isCollapsed && <ChevronDown className="size-4" />}
                        </div>

                        {!isCollapsed && (
                          <div className="ml-7 mt-1 space-y-1">
                            {item.children.map((child) => {
                              const isChildActive = child.href === pathname;

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className={`block rounded-xl px-3 py-2 text-white/75 transition hover:bg-white/10 hover:text-white ${isChildActive ? "bg-white/10 text-white" : ""
                                    }`}
                                >
                                  {child.title}
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
                      title={isCollapsed ? item.title : undefined}
                      className={`flex items-center rounded-2xl px-3 py-2 transition ${isCollapsed ? "justify-center" : "gap-3"
                        } ${isActive
                          ? "bg-[#75FF33] font-semibold text-[#00552E]"
                          : "text-white/85 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <Icon className="size-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4">
          <div
            className={`flex items-center rounded-2xl bg-white p-3 text-black ${isCollapsed ? "justify-center" : "justify-between"
              }`}
          >
            {!isCollapsed ? (
              <>
                <div>
                  <p className="font-semibold">Marco Rossi</p>
                  <p className="text-black/60">Master Admin</p>
                </div>

                <button type="button" aria-label="Logout">
                  <LogOut className="size-5 text-red-500" />
                </button>
              </>
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-[#00552E] text-sm font-bold text-white">
                MR
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;