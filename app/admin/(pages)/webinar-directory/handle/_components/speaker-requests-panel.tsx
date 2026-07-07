"use client";

import { useMemo } from "react";
import { Hand, TrendingUp, UserRoundPlus, X } from "lucide-react";

import type { WebinarUserItem } from "@/types/webinar/webinar_type";

export type PanelTab = "requests" | "participants";

interface SpeakerRequestsPanelProps {
  activeTab: PanelTab;
  speakerRequests: WebinarUserItem[];
  participants: WebinarUserItem[];
  isLoading: boolean;
  isActionLoading: boolean;
  onTabChange: (tab: PanelTab) => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

const getDisplayName = (user: WebinarUserItem) =>
  user.fullName?.trim() ||
  (user.userId ? `User ${user.userId.slice(0, 8)}` : "Not available");

const getRoleText = (user: WebinarUserItem) =>
  user.role ? user.role.replace(/_/g, " ") : "Not available";

const CountChip = ({ count }: { count: number }) => (
  <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600">
    {count}
  </span>
);

export default function SpeakerRequestsPanel({
  activeTab,
  speakerRequests,
  participants,
  isLoading,
  isActionLoading,
  onTabChange,
  onApprove,
  onReject,
}: SpeakerRequestsPanelProps) {
  const visibleList = activeTab === "requests" ? speakerRequests : participants;
  const emptyText =
    activeTab === "requests"
      ? "No pending speaker requests."
      : "No participants joined yet.";

  const engagementText = useMemo(() => {
    if (participants.length === 0) return "0% Active";
    const activeCount = participants.filter((item) => !item.leftAt).length;
    return `${Math.round((activeCount / participants.length) * 100)}% Active`;
  }, [participants]);

  return (
    <aside className="flex min-h-[690px] flex-col justify-between rounded-[32px] bg-white p-7 shadow-sm">
      <div>
        <div className="mb-7 rounded-full bg-[#E3E9E2] p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => onTabChange("requests")}
              className={`flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
                activeTab === "requests"
                  ? "bg-white text-[#007A4D] shadow-sm"
                  : "text-[#4E5A52]"
              }`}
            >
              <span className="truncate">Speaker Requests</span>
              <CountChip count={speakerRequests.length} />
            </button>
            <button
              type="button"
              onClick={() => onTabChange("participants")}
              className={`flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${
                activeTab === "participants"
                  ? "bg-white text-[#007A4D] shadow-sm"
                  : "text-[#4E5A52]"
              }`}
            >
              <span className="truncate">All Participants</span>
              <CountChip count={participants.length} />
            </button>
          </div>
        </div>

        <div className="mb-7 flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-[#007A4D]">
                {activeTab === "requests" ? "Speaker Requests" : "All Participants"}
              </h2>
              <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                {activeTab === "requests" ? speakerRequests.length : participants.length}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#4E5A52]">
              ⊕ {activeTab === "requests" ? "Pending Requests" : "Participants"}
            </p>
          </div>

          <div className="flex gap-3">
            <UserRoundPlus className="size-5 text-[#007A4D]" />
            <Hand className="size-5 text-[#202420]" />
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl bg-[#F1F6EE] p-5 text-sm text-[#66736B]">
            Loading...
          </div>
        ) : visibleList.length === 0 ? (
          <div className="rounded-3xl bg-[#F1F6EE] p-5 text-sm text-[#66736B]">
            {emptyText}
          </div>
        ) : (
          <div className="max-h-[450px] space-y-5 overflow-y-auto pr-1">
            {visibleList.map((item) => (
              <div
                key={`${activeTab}-${item.userId}`}
                className="rounded-3xl border border-[#EDF2EA] bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  {item.profilePhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.profilePhoto}
                      alt={getDisplayName(item)}
                      className="size-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-11 items-center justify-center rounded-full bg-[#D9E6D8] text-xs font-bold text-[#007A4D]">
                      NA
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#202420]">
                      {getDisplayName(item)}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8B958E]">
                      {getRoleText(item)}
                    </p>
                  </div>
                </div>

                {activeTab === "requests" ? (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => onApprove(item.userId)}
                      className="flex-1 rounded-full bg-[#E6F8E7] py-3 text-sm font-semibold uppercase text-[#007A4D] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => onReject(item.userId)}
                      className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#F1F6EE] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#4E5A52]">
                    {item.leftAt ? "Left webinar" : "Active now"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-[#F1F6EE] p-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#DCEFE3] text-[#007A4D]">
            <TrendingUp className="size-5" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-[#202420]">Engagement</p>
            <p className="text-[10px] uppercase text-[#7B857E]">
              {engagementText}
            </p>
          </div>

          <p className="text-sm font-bold text-[#007A4D]">
            {participants.length} joined
          </p>
        </div>
      </div>
    </aside>
  );
}
