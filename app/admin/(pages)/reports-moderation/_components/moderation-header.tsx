"use client";

import { Loader2, RefreshCw } from "lucide-react";

interface ModerationHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export default function ModerationHeader({
  isRefreshing,
  onRefresh,
}: ModerationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-black/90">
          Report & Moderation Center
        </h1>

        <p className="mt-2 text-sm text-black/55">
          Review and resolve reports submitted across the platform.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black/70 shadow-sm">
          <span className="mr-2 inline-block size-2 rounded-full bg-[#75FF33]" />
          Backend Connected
        </div>

        <button
          type="button"
          disabled={isRefreshing}
          onClick={onRefresh}
          className="flex size-10 items-center justify-center rounded-full bg-white text-secondary shadow-sm transition hover:bg-[#EEF3EC] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Refresh moderation data"
        >
          {isRefreshing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
