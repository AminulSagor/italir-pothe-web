"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import type {
  EvaluationQueueSortBy,
  EvaluationQueueSortOrder,
  FinalExamAttemptStatus,
} from "@/types/evaluation-center/evaluation-center.type";

interface EvaluationToolbarProps {
  initialSearchValue: string;

  status?: FinalExamAttemptStatus;

  level: string;

  sortBy: EvaluationQueueSortBy;

  sortOrder: EvaluationQueueSortOrder;

  onSearchChange: (value: string) => void;

  onStatusChange: (value: string) => void;

  onLevelChange: (value: string) => void;

  onSortByChange: (value: EvaluationQueueSortBy) => void;

  onSortOrderChange: (value: EvaluationQueueSortOrder) => void;
}

export default function EvaluationToolbar({
  initialSearchValue,
  status,
  level,
  sortBy,
  sortOrder,
  onSearchChange,
  onStatusChange,
  onLevelChange,
  onSortByChange,
  onSortOrderChange,
}: EvaluationToolbarProps) {
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedSearch = searchValue.trim();

      if (normalizedSearch !== initialSearchValue) {
        onSearchChange(normalizedSearch);
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [initialSearchValue, onSearchChange, searchValue]);

  return (
    <div className="space-y-4">
      <div className="flex h-14 items-center gap-3 rounded-full bg-white px-5 shadow-sm">
        <Search className="size-4 text-[#6B776F]" />

        <input
          type="search"
          value={searchValue}
          placeholder="Search by student name, email, or reference code..."
          onChange={(event) => setSearchValue(event.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#A0AAA2]"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          label="SORT"
          value={sortBy}
          onChange={(value) => onSortByChange(value as EvaluationQueueSortBy)}
          options={[
            {
              label: "Time in Queue",
              value: "timeInQueue",
            },
            {
              label: "Submission Date",
              value: "submissionDate",
            },
            {
              label: "Student Name",
              value: "studentName",
            },
            {
              label: "Status",
              value: "status",
            },
          ]}
        />

        <FilterSelect
          label="ORDER"
          value={sortOrder}
          onChange={(value) =>
            onSortOrderChange(value as EvaluationQueueSortOrder)
          }
          options={[
            {
              label: "Descending",
              value: "DESC",
            },
            {
              label: "Ascending",
              value: "ASC",
            },
          ]}
        />

        <FilterSelect
          label="STATUS"
          value={status || ""}
          onChange={onStatusChange}
          options={[
            {
              label: "All",
              value: "",
            },
            {
              label: "Awaiting Review",
              value: "under_review",
            },
            {
              label: "Evaluated",
              value: "evaluated",
            },
            {
              label: "Retake Requested",
              value: "retake_requested",
            },
            {
              label: "Certificate Issued",
              value: "certificate_issued",
            },
          ]}
        />

        <FilterSelect
          label="LEVEL"
          value={level}
          onChange={onLevelChange}
          options={[
            {
              label: "All",
              value: "",
            },
            {
              label: "A1",
              value: "A1",
            },
            {
              label: "A2",
              value: "A2",
            },
            {
              label: "B1",
              value: "B1",
            },
            {
              label: "B2",
              value: "B2",
            },
            {
              label: "C1",
              value: "C1",
            },
            {
              label: "C2",
              value: "C2",
            },
          ]}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;

  options: Array<{
    label: string;
    value: string;
  }>;

  onChange: (value: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full bg-[#EEF5EE] px-5 py-3 text-xs font-medium text-[#4F5B52]">
      <SlidersHorizontal className="size-3" />

      <span>{label}:</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent font-medium outline-none"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
