"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { adminNavigation } from "../../constant/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

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
          <div className="flex size-8 items-center justify-center rounded-full bg-[#75FF33] font-bold text-[#00552E]">
            I
          </div>
          <h1 className="font-bold">ItalirPothe</h1>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {adminNavigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 font-semibold uppercase text-white/50">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href === pathname;

                  if (item.children?.length) {
                    return (
                      <div key={item.title}>
                        <div className="flex items-center justify-between rounded-2xl px-3 py-2 text-white/85">
                          <div className="flex items-center gap-3">
                            <Icon className="size-4" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className="size-4" />
                        </div>

                        <div className="ml-7 mt-1 space-y-1">
                          {item.children.map((child) => {
                            const isChildActive = child.href === pathname;

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onClose}
                                className={`block rounded-xl px-3 py-2 text-white/75 transition hover:bg-white/10 hover:text-white ${
                                  isChildActive ? "bg-white/10 text-white" : ""
                                }`}
                              >
                                {child.title}
                              </Link>
                            );
                          })}
                        </div>
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
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4">
          <div className="flex items-center justify-between rounded-2xl bg-white p-3 text-black">
            <div>
              <p className="font-semibold">Marco Rossi</p>
              <p className="text-black/60">Master Admin</p>
            </div>

            <button type="button" aria-label="Logout">
              <LogOut className="size-5 text-red-500" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
