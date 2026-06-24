"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bell, CircleHelp, MessageSquare, Search } from "lucide-react";

interface RewardHistoryHeaderProps {
  initialSearchValue: string;
  onSearchCommit: (value: string) => void;
}

export default function RewardHistoryHeader({
  initialSearchValue,
  onSearchCommit,
}: RewardHistoryHeaderProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch !== initialSearchValue) {
        onSearchCommit(normalizedSearch);
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [initialSearchValue, onSearchCommit, searchValue]);

  return (
    <header className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-14 w-full items-center gap-4 rounded-full bg-[#EEF3EC] px-6 text-black/40 lg:max-w-[420px]">
          <Search className="size-5" />

          <input
            type="search"
            value={searchValue}
            placeholder="Search shipments..."
            onChange={(event) => setSearchValue(event.target.value)}
            className="w-full bg-transparent text-sm text-black/75 outline-none placeholder:text-black/40"
          />
        </div>

        <div className="flex items-center gap-6">
          <Bell className="size-6 text-black/75" />
          <MessageSquare className="size-6 text-black/75" />
          <CircleHelp className="size-6 text-black/75" />

          <div className="flex items-center gap-4 border-l border-black/10 pl-6">
            <div className="text-right">
              <p className="font-bold text-secondary">Administrator Profile</p>

              <p className="text-xs text-black/45">System Master</p>
            </div>

            <Image
              src="/images/sarah-jenkins.png"
              alt="Administrator"
              width={52}
              height={52}
              className="size-13 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-black/55">
          Gamification <span className="mx-2">›</span>
          <span className="text-secondary">History</span>
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-black/90">
          Reward Distribution History
        </h1>
      </div>
    </header>
  );
}
