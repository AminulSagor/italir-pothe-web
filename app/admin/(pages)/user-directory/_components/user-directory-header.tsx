"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bell, Search, ShieldBan } from "lucide-react";

interface UserDirectoryHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onQuickRestrict: () => void;
}

export default function UserDirectoryHeader({
  search,
  onSearchChange,
  onQuickRestrict,
}: UserDirectoryHeaderProps) {
  const [searchValue, setSearchValue] = useState(search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch !== search) {
        onSearchChange(normalizedSearch);
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [onSearchChange, search, searchValue]);

  return (
    <header className="space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-14 w-full items-center gap-4 rounded-full bg-[#EEF3EC] px-6 text-black/40 lg:max-w-[650px]">
          <Search className="size-5" />

          <input
            type="search"
            value={searchValue}
            placeholder="Search by name, email, or phone..."
            onChange={(event) => setSearchValue(event.target.value)}
            className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/40"
          />
        </div>

        <div className="flex items-center gap-5">
          <Bell className="size-6 text-black/75" />

          <button
            type="button"
            onClick={onQuickRestrict}
            className="flex size-10 items-center justify-center rounded-full text-black/75 transition hover:bg-[#EEF3EC]"
            aria-label="Quick restrict user"
          >
            <ShieldBan className="size-6" />
          </button>

          <button
            type="button"
            onClick={onQuickRestrict}
            className="rounded-full bg-secondary px-8 py-4 text-sm font-bold text-white"
          >
            Quick Ban
          </button>

          <Image
            src="/images/sarah-jenkins.png"
            alt="Admin"
            width={52}
            height={52}
            className="size-13 rounded-full object-cover"
          />
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-deep-green">
        User Directory
      </h1>
    </header>
  );
}
