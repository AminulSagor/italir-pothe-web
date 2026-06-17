"use client";

import { ChevronDown, Search } from "lucide-react";

import type { CourseStatus } from "@/types/course-directory/course.type";

interface CourseDirectoryFiltersProps {
  search: string;
  status: CourseStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CourseStatus | "") => void;
}

const CourseDirectoryFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: CourseDirectoryFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex flex-1 items-center gap-3">
        <Search className="size-5 text-black/60" />

        <input
          type="search"
          value={search}
          placeholder="Search courses by name or keyword..."
          onChange={(event) => onSearchChange(event.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
        />
      </div>

      <div className="hidden h-8 w-px bg-black/10 lg:block" />

      <div className="relative">
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as CourseStatus | "")
          }
          className="min-w-40 appearance-none bg-transparent pr-8 text-sm text-black/60 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-black/60" />
      </div>
    </div>
  );
};

export default CourseDirectoryFilters;
