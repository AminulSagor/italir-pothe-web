import { ChevronDown, Search } from "lucide-react";

const CourseDirectoryFilters = () => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-4 shadow-sm lg:flex-row lg:items-center">
      <div className="flex flex-1 items-center gap-3">
        <Search className="size-5 text-black/60" />
        <input
          type="search"
          placeholder="Search courses by name or keyword..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
        />
      </div>

      <div className="hidden h-8 w-px bg-black/10 lg:block" />

      <button
        type="button"
        className="flex items-center justify-between gap-10 text-sm text-black/60"
      >
        All Categories
        <ChevronDown className="size-4" />
      </button>

      <div className="hidden h-8 w-px bg-black/10 lg:block" />

      <button
        type="button"
        className="flex items-center justify-between gap-10 text-sm text-black/60"
      >
        All Statuses
        <ChevronDown className="size-4" />
      </button>
    </div>
  );
};

export default CourseDirectoryFilters;
