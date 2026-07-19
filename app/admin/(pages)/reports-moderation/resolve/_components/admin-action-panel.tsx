"use client";

import { Ban, Loader2, Shield, ShieldCheck, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import type {
  ModerationActionType,
  ModerationReportOverview,
  ModerationSubjectStats,
} from "@/types/reports-moderation/reports-moderation.type";

import PermanentBanModal from "./permanent-ban-modal";

interface AdminActionPanelProps {
  overview: ModerationReportOverview;
  subject: ModerationSubjectStats;
  isFinalDecision: boolean;
  activeAction: ModerationActionType | null;
  onAction: (
    actionType: ModerationActionType,
    actionReason: string,
  ) => Promise<boolean>;
  onReturnToQueue: () => void;
}

export default function AdminActionPanel({
  overview,
  subject,
  isFinalDecision,
  activeAction,
  onAction,
  onReturnToQueue,
}: AdminActionPanelProps) {
  const [actionReason, setActionReason] = useState("");
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isBanSuccess, setIsBanSuccess] = useState(false);

  const isSubmitting = activeAction !== null;
  const hasReason = actionReason.trim().length > 0;
  const canBan = !subject.is_banned && !subject.isDeleted;

  const runAction = async (actionType: ModerationActionType) => {
    const succeeded = await onAction(actionType, actionReason);

    if (succeeded && actionType !== "permanent_ban") {
      setActionReason("");
    }

    return succeeded;
  };

  return (
    <>
      <aside className="h-fit rounded-[2rem] bg-white p-7 shadow-xl shadow-black/5">
        <div className="flex items-center gap-4">
          <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-white">
            <ShieldCheck className="size-6" />
          </span>

          <div>
            <h2 className="text-lg font-bold text-black/90">Admin Action</h2>
            <p className="text-xs uppercase text-black/35">
              {isFinalDecision ? "Final decision recorded" : "Decision required"}
            </p>
          </div>
        </div>

        <div className="mt-9">
          <label
            htmlFor="moderation-action-reason"
            className="mb-4 block text-xs font-bold uppercase text-black/35"
          >
            Action Reason (Mandatory)
          </label>

          <textarea
            id="moderation-action-reason"
            value={actionReason}
            onChange={(event) => setActionReason(event.target.value)}
            disabled={isFinalDecision || isSubmitting}
            maxLength={1000}
            placeholder="Record the evidence reviewed and the reason for this decision..."
            className="min-h-[170px] w-full resize-none rounded-[2rem] bg-[#EEF3EC] p-6 text-base leading-7 outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-55"
          />
          <p className="mt-2 text-right text-xs text-black/35">
            {actionReason.length}/1000
          </p>
        </div>

        {isFinalDecision ? (
          <div className="mt-7 rounded-[1.75rem] bg-[#EEF3EC] p-6 text-center">
            <p className="font-bold capitalize text-black/70">
              Case {overview.status}
            </p>
            <p className="mt-2 text-sm leading-6 text-black/45">
              This case already has a final moderation decision. Review the action history for details.
            </p>
            <button
              type="button"
              onClick={onReturnToQueue}
              className="mt-5 rounded-full bg-secondary px-6 py-3 text-sm font-bold text-white"
            >
              Return to Queue
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <ActionButton
              label="Record Formal Warning"
              action="formal_warning"
              activeAction={activeAction}
              disabled={!hasReason || isSubmitting}
              onClick={() => void runAction("formal_warning")}
              icon={<TriangleAlert className="size-5" />}
              className="bg-secondary text-white"
            />

            <ActionButton
              label={subject.is_banned ? "Account Already Banned" : "Permanent Account Ban"}
              action="permanent_ban"
              activeAction={activeAction}
              disabled={!hasReason || isSubmitting || !canBan}
              onClick={() => setIsBanModalOpen(true)}
              icon={<Ban className="size-5" />}
              className="bg-red-700 text-white"
            />

            <div className="h-px bg-black/10" />

            <ActionButton
              label="Dismiss Report"
              action="dismiss"
              activeAction={activeAction}
              disabled={!hasReason || isSubmitting}
              onClick={() => void runAction("dismiss")}
              icon={<X className="size-5" />}
              className="bg-[#DDE3DA] text-black/55"
            />
          </div>
        )}

        <div className="mt-8 rounded-[2rem] bg-green-100 p-6">
          <p className="text-xs font-bold uppercase text-green-700">
            Moderator Note
          </p>

          <div className="mt-3 flex gap-3">
            <Shield className="mt-1 size-5 shrink-0 text-green-700" />

            <p className="text-sm leading-6 text-green-700">
              Base the decision only on the report details and user-submitted evidence available in this case.
            </p>
          </div>
        </div>
      </aside>

      <PermanentBanModal
        isOpen={isBanModalOpen}
        isSuccess={isBanSuccess}
        isSubmitting={activeAction === "permanent_ban"}
        subjectName={subject.name || "this user"}
        reportReason={overview.reportReason}
        onConfirm={async () => {
          const succeeded = await runAction("permanent_ban");
          if (succeeded) {
            setIsBanSuccess(true);
            setActionReason("");
          }
        }}
        onClose={() => {
          setIsBanModalOpen(false);
          setIsBanSuccess(false);
        }}
        onReturnToQueue={onReturnToQueue}
      />
    </>
  );
}

interface ActionButtonProps {
  label: string;
  action: ModerationActionType;
  activeAction: ModerationActionType | null;
  disabled: boolean;
  onClick: () => void;
  icon: ReactNode;
  className: string;
}

function ActionButton({
  label,
  action,
  activeAction,
  disabled,
  onClick,
  icon,
  className,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-16 w-full items-center justify-center gap-3 rounded-full px-5 text-base font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
    >
      {activeAction === action ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
