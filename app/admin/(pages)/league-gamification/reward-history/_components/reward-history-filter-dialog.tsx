"use client";

import { useState } from "react";
import { X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type {
  LeaderboardSortOrder,
  RewardHistorySortBy,
} from "@/types/leaderboard/leaderboard.type";

export interface RewardHistoryFilterValues {
  status: string;
  rewardType: string;
  league: string;
  dateFrom: string;
  dateTo: string;
  sortBy: RewardHistorySortBy;
  sortOrder: LeaderboardSortOrder;
}

interface RewardHistoryFilterDialogProps {
  open: boolean;
  values: RewardHistoryFilterValues;
  onClose: () => void;
  onApply: (values: RewardHistoryFilterValues) => void;
}

const emptyFilters: RewardHistoryFilterValues = {
  status: "",
  rewardType: "",
  league: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "createdAt",
  sortOrder: "DESC",
};

export default function RewardHistoryFilterDialog({
  open,
  values,
  onClose,
  onApply,
}: RewardHistoryFilterDialogProps) {
  const [draft, setDraft] = useState(values);

  const updateDraft = <Key extends keyof RewardHistoryFilterValues>(
    key: Key,
    value: RewardHistoryFilterValues[Key],
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} size="lg" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC]"
          aria-label="Close reward filters"
        >
          <X className="size-4 text-black/55" />
        </button>

        <h2 className="text-xl font-bold text-secondary">
          Filter Reward History
        </h2>
      </div>

      <div className="grid gap-5 px-7 py-6 sm:grid-cols-2">
        <SelectField
          label="Status"
          value={draft.status}
          onChange={(value) => updateDraft("status", value)}
          options={[
            {
              label: "All Statuses",
              value: "",
            },
            {
              label: "Pending",
              value: "pending",
            },
            {
              label: "Notified",
              value: "notified",
            },
            {
              label: "Opened",
              value: "opened",
            },
            {
              label: "Address Pending",
              value: "address_pending",
            },
            {
              label: "Address Received",
              value: "address_received",
            },
            {
              label: "Approved",
              value: "approved",
            },
            {
              label: "Processing",
              value: "processing",
            },
            {
              label: "Dispatched",
              value: "dispatched",
            },
            {
              label: "Delivered",
              value: "delivered",
            },
            {
              label: "Issued",
              value: "issued",
            },
            {
              label: "Claimed",
              value: "claimed",
            },
            {
              label: "Revoked",
              value: "revoked",
            },
            {
              label: "Cancelled",
              value: "cancelled",
            },
            {
              label: "Failed",
              value: "failed",
            },
          ]}
        />

        <SelectField
          label="Reward Type"
          value={draft.rewardType}
          onChange={(value) => updateDraft("rewardType", value)}
          options={[
            {
              label: "All Reward Types",
              value: "",
            },
            {
              label: "Physical Prize",
              value: "physical_prize",
            },
            {
              label: "Physical Gift",
              value: "physical_gift",
            },
            {
              label: "Streak Freeze",
              value: "streak_freeze",
            },
            {
              label: "CV Credits",
              value: "cv_credits",
            },
            {
              label: "AI Package",
              value: "ai_package",
            },
            {
              label: "XP",
              value: "xp",
            },
            {
              label: "Course Access",
              value: "course_access",
            },
            {
              label: "Downloadable File",
              value: "downloadable_file",
            },
            {
              label: "Certificate",
              value: "certificate",
            },
            {
              label: "Badge",
              value: "badge",
            },
          ]}
        />

        <SelectField
          label="League"
          value={draft.league}
          onChange={(value) => updateDraft("league", value)}
          options={[
            {
              label: "All Leagues",
              value: "",
            },
            {
              label: "Bronze",
              value: "bronze",
            },
            {
              label: "Silver",
              value: "silver",
            },
            {
              label: "Gold",
              value: "gold",
            },
            {
              label: "Diamond",
              value: "diamond",
            },
          ]}
        />

        <SelectField
          label="Sort By"
          value={draft.sortBy}
          onChange={(value) =>
            updateDraft("sortBy", value as RewardHistorySortBy)
          }
          options={[
            {
              label: "Award Date",
              value: "createdAt",
            },
            {
              label: "Title",
              value: "title",
            },
            {
              label: "Status",
              value: "status",
            },
            {
              label: "Reward Type",
              value: "rewardType",
            },
            {
              label: "Recipient",
              value: "recipient",
            },
          ]}
        />

        <label>
          <span className="mb-2 block text-xs font-bold uppercase text-black/40">
            Date From
          </span>

          <input
            type="date"
            value={draft.dateFrom}
            onChange={(event) => updateDraft("dateFrom", event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase text-black/40">
            Date To
          </span>

          <input
            type="date"
            value={draft.dateTo}
            onChange={(event) => updateDraft("dateTo", event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
          />
        </label>

        <SelectField
          label="Sort Order"
          value={draft.sortOrder}
          onChange={(value) =>
            updateDraft("sortOrder", value as LeaderboardSortOrder)
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
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setDraft(emptyFilters);
            onApply(emptyFilters);
          }}
        >
          Reset
        </Button>

        <Button onClick={() => onApply(draft)}>Apply Filters</Button>
      </div>
    </Dialog>
  );
}

function SelectField({
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
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
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
