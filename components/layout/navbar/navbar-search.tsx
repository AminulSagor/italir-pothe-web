"use client";

import { Search } from "lucide-react";

const NavbarSearch = () => {
  return (
    <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-black/10 bg-gray-50 px-3 py-2 md:flex">
      <Search className="size-4 text-gray-500" />

      <input
        type="search"
        placeholder="Search..."
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </div>
  );
};

export default NavbarSearch;
