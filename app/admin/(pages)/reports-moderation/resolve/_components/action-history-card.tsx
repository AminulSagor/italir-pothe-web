import { History } from "lucide-react";

import type { ModerationActionHistoryItem } from "@/types/reports-moderation/reports-moderation.type";

interface ActionHistoryCardProps {
  items: ModerationActionHistoryItem[];
}

const formatAction = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function ActionHistoryCard({ items }: ActionHistoryCardProps) {
  return (
    <section className="rounded-[2rem] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-amber-50 text-secondary">
          <History className="size-5" />
        </span>
        <h2 className="text-lg font-bold text-black/90">Action History</h2>
      </div>

      {items.length === 0 ? (
        <p className="mt-7 rounded-[1.5rem] bg-[#F4F8F1] p-5 text-sm text-black/45">
          No moderator action has been recorded for this case.
        </p>
      ) : (
        <div className="mt-7 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[1.5rem] border border-black/5 bg-[#F4F8F1] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-black/80">
                  {formatAction(item.actionType)}
                </p>
                <p className="text-xs text-black/40">{formatDate(item.loggedAt)}</p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-black/60">
                {item.actionReason}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase text-secondary">
                {item.moderatorName || "Moderator account unavailable"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
