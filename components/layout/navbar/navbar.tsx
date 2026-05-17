"use client";

import { Menu } from "lucide-react";
import NavbarActions from "./navbar-actions";
import NavbarSearch from "./navbar-search";
import NavbarUserMenu from "./navbar-user-menu";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-black/10 bg-white px-4 backdrop-blur lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl border border-black/10 p-2 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="size-5" />
      </button>

      <NavbarSearch />

      <div className="ml-auto flex items-center gap-4">
        <NavbarActions />
        <NavbarUserMenu />
      </div>
    </header>
  );
};

export default Navbar;
