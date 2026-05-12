"use client";

import { Bell, HelpCircle, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 bg-white/90 px-4 backdrop-blur dark:border-white/10 dark:bg-black/80 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl border border-black/10 p-2 dark:border-white/10 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden rounded-full bg-green-100 px-4 py-1 font-semibold text-green-700 lg:block">
        System Online
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button type="button" aria-label="Notifications">
          <Bell className="size-5" />
        </button>

        <button type="button" aria-label="Help">
          <HelpCircle className="size-5" />
        </button>

        <div className="text-right">
          <p className="font-semibold">Root Admin</p>
          <p className="text-muted-foreground">System Oversight</p>
        </div>

        <div className="size-9 rounded-full bg-green-100" />
      </div>
    </header>
  );
};

export default Navbar;
