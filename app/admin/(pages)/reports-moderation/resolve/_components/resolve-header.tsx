"use client";

import { ArrowLeft, RefreshCw } from "lucide-react";

import type { ModerationReportStatus } from "@/types/reports-moderation/reports-moderation.type";

interface ResolveHeaderProps {
  caseNumber: string;
  status: ModerationReportStatus;
  isRefreshing: boolean;
  onBack: () => void;
  onRefresh: () => void;
}

const statusClass: Record<ModerationReportStatus, string> = {
  pending: "bg-orange-50 text-orange-700",
  processing: "bg-emerald-50 text-emerald-700",
  resolved: "bg-black/5 text-black/55",
  banned: "bg-red-50 text-red-700",
};

export default function ResolveHeader({
  caseNumber,
  status,
  isRefreshing,
  onBack,
  onRefresh,
}: ResolveHeaderProps) {
  return (
    <header>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-3 text-sm font-semibold uppercase text-secondary"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft className="size-5" />
          </span>
          Back to Moderation Queue
        </button>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-secondary shadow-sm disabled:opacity-50"
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/35">
            Moderation Queue <span className="mx-2">›</span>
            <span className="text-secondary">{caseNumber}</span>
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-deep-green">
            Resolve Report
          </h1>
        </div>

        <span
          className={`rounded-full px-5 py-2 text-xs font-bold uppercase ${statusClass[status]}`}
        >
          {status}
        </span>
      </div>
    </header>
  );
}
