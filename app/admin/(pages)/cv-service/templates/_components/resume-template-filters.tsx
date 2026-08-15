"use client";

import { Search, X } from "lucide-react";

import type { ResumeTemplateStatus } from "@/types/resume-studio/resume-template.types";

interface ResumeTemplateFiltersProps {
  search: string;
  category: string;
  status: ResumeTemplateStatus | "";
  total: number;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ResumeTemplateStatus | "") => void;
  onClear: () => void;
}

export default function ResumeTemplateFilters({
  search,
  category,
  status,
  total,
  isLoading,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onClear,
}: ResumeTemplateFiltersProps) {
  const hasFilters = Boolean(search || category || status);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_220px_190px_auto] lg:items-center">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/35" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, slug or description..."
            className="h-12 w-full rounded-full bg-[#EEF3EB] pl-11 pr-5 text-sm outline-none placeholder:text-black/30"
          />
        </div>

        <input
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          placeholder="Filter category"
          className="h-12 rounded-full bg-[#EEF3EB] px-5 text-sm outline-none placeholder:text-black/30"
        />

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as ResumeTemplateStatus | "")
          }
          className="h-12 rounded-full bg-[#EEF3EB] px-5 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <span className="whitespace-nowrap text-sm text-black/50">
            {isLoading ? "Loading…" : `${total} template${total === 1 ? "" : "s"}`}
          </span>

          {hasFilters && (
            <button
              type="button"
              onClick={onClear}
              className="flex size-10 items-center justify-center rounded-full bg-[#EEF3EB] text-black/55 transition hover:bg-[#E2EAE0]"
              aria-label="Clear template filters"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
