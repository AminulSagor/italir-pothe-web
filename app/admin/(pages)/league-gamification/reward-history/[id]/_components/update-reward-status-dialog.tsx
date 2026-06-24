"use client";

import { Loader2, RefreshCw, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { LeaderboardRewardStatus } from "@/types/leaderboard/leaderboard.type";

interface UpdateRewardStatusDialogProps {
  open: boolean;
  currentStatus: LeaderboardRewardStatus;

  nextStatus: LeaderboardRewardStatus | "";

  isSubmitting: boolean;

  onStatusChange: (status: LeaderboardRewardStatus | "") => void;

  onClose: () => void;
  onSubmit: () => void;
}

const transitions: Record<LeaderboardRewardStatus, LeaderboardRewardStatus[]> =
  {
    pending: ["notified", "revoked", "cancelled"],

    notified: ["opened", "address_pending", "revoked"],

    opened: ["address_pending", "processing", "claimed", "issued", "revoked"],

    address_pending: ["address_received", "revoked"],

    address_received: ["approved", "processing", "dispatched", "revoked"],

    approved: ["processing", "dispatched", "revoked"],

    processing: ["dispatched", "claimed", "issued", "revoked"],

    dispatched: ["delivered"],

    delivered: [],
    issued: [],
    claimed: [],
    revoked: [],
    cancelled: [],

    failed: ["processing", "revoked"],
  };

const formatLabel = (value: string) => {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default function UpdateRewardStatusDialog({
  open,
  currentStatus,
  nextStatus,
  isSubmitting,
  onStatusChange,
  onClose,
  onSubmit,
}: UpdateRewardStatusDialogProps) {
  const availableStatuses = transitions[currentStatus];

  return (
    <Dialog open={open} onClose={onClose} size="sm" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
          aria-label="Close status dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-bold text-secondary">
          Update Reward Status
        </h2>
      </div>

      <div className="space-y-5 px-7 py-6">
        <div className="rounded-full bg-[#EEF3EC] px-5 py-4 text-sm">
          Current status: <strong>{formatLabel(currentStatus)}</strong>
        </div>

        {availableStatuses.length > 0 ? (
          <label>
            <span className="mb-2 block text-xs font-bold uppercase text-black/40">
              New Status
            </span>

            <select
              value={nextStatus}
              disabled={isSubmitting}
              onChange={(event) =>
                onStatusChange(
                  event.target.value as LeaderboardRewardStatus | "",
                )
              }
              className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
            >
              <option value="">Select status</option>

              {availableStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-sm leading-6 text-black/55">
            This reward is in a final state and has no available status
            transitions.
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={isSubmitting || !nextStatus} onClick={onSubmit}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 size-4" />
          )}
          Update Status
        </Button>
      </div>
    </Dialog>
  );
}
