"use client";

import { ArrowLeft, Bell, FileText, Mail, MessageSquare } from "lucide-react";

import type { LeaderboardRewardDetail } from "@/types/leaderboard/leaderboard.type";

interface RewardDetailHeaderProps {
  detail: LeaderboardRewardDetail;
  onBack: () => void;
  onOpenUpdate: () => void;
  onRequestAddress: () => void;
  onDownloadInvoice: () => void;
}

export default function RewardDetailHeader({
  detail,
  onBack,
  onOpenUpdate,
  onRequestAddress,
  onDownloadInvoice,
}: RewardDetailHeaderProps) {
  const canDownloadInvoice = detail.availableActions.canDownloadInvoice;

  const canRequestAddress = detail.availableActions.canResendAddressRequest;

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onBack}
          className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-secondary"
          aria-label="Back to reward history"
        >
          <ArrowLeft className="size-5" />
        </button>

        <p className="text-sm font-bold uppercase tracking-wide text-black/55">
          Gamification <span className="mx-2">›</span>
          Reward History <span className="mx-2">›</span>
          <span className="text-secondary">Reward Detail</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onOpenUpdate}
          disabled={!detail.availableActions.canSendUpdateNotification}
          className="flex size-12 items-center justify-center rounded-full bg-[#EEF3EC] text-black/65 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send update notification"
        >
          <Bell className="size-5" />
        </button>

        <button
          type="button"
          onClick={onOpenUpdate}
          disabled={!detail.availableActions.canSendUpdateNotification}
          className="flex size-12 items-center justify-center rounded-full bg-[#EEF3EC] text-black/65 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <MessageSquare className="size-5" />
        </button>

        {canDownloadInvoice ? (
          <button
            type="button"
            onClick={onDownloadInvoice}
            className="flex h-12 items-center justify-center gap-3 rounded-full bg-secondary px-8 text-sm font-bold uppercase text-white shadow-lg shadow-green-900/15"
          >
            <FileText className="size-5" />
            Download Invoice
          </button>
        ) : canRequestAddress ? (
          <button
            type="button"
            onClick={onRequestAddress}
            className="flex h-12 items-center justify-center gap-3 rounded-full bg-secondary px-8 text-sm font-bold uppercase text-white shadow-lg shadow-green-900/15"
          >
            <Mail className="size-5" />
            Resend Address Request
          </button>
        ) : null}
      </div>
    </header>
  );
}
