import { CircleCheck, CircleX, RefreshCw, Send, Truck } from "lucide-react";

import type { RewardAvailableActions } from "@/types/leaderboard/leaderboard.type";

interface FulfillmentActionsCardProps {
  actions: RewardAvailableActions;
  onSendUpdate: () => void;
  onUpdateStatus: () => void;
  onDispatch: () => void;
  onMarkDelivered: () => void;
  onRevoke: () => void;
}

export default function FulfillmentActionsCard({
  actions,
  onSendUpdate,
  onUpdateStatus,
  onDispatch,
  onMarkDelivered,
  onRevoke,
}: FulfillmentActionsCardProps) {
  const hasActions =
    actions.canSendUpdateNotification ||
    actions.canDispatch ||
    actions.canMarkDelivered ||
    actions.canRevoke;

  if (!hasActions) return null;

  return (
    <aside className="h-fit rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-black/45">
        Fulfillment Actions
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {actions.canSendUpdateNotification && (
          <button
            type="button"
            onClick={onSendUpdate}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#E6F6E2] text-sm font-bold uppercase text-secondary"
          >
            <Send className="size-5" />
            Send Update Notification
          </button>
        )}

        <button
          type="button"
          onClick={onUpdateStatus}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#EEF3EC] text-sm font-bold uppercase text-black/65"
        >
          <RefreshCw className="size-5" />
          Update Status
        </button>

        {actions.canDispatch && (
          <button
            type="button"
            onClick={onDispatch}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#DFF3FF] text-sm font-bold uppercase text-[#2870B8]"
          >
            <Truck className="size-5" />
            Dispatch Reward
          </button>
        )}

        {actions.canMarkDelivered && (
          <button
            type="button"
            onClick={onMarkDelivered}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#DDF7D7] text-sm font-bold uppercase text-[#56A54A]"
          >
            <CircleCheck className="size-5" />
            Mark Delivered
          </button>
        )}

        {actions.canRevoke && (
          <button
            type="button"
            onClick={onRevoke}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#F8F4F3] text-sm font-bold uppercase text-[#D22B2B]"
          >
            <CircleX className="size-5" />
            Revoke Reward
          </button>
        )}
      </div>
    </aside>
  );
}
