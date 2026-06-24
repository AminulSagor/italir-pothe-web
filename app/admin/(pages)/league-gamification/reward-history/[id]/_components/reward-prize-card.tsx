import {
  Award,
  BookOpen,
  Bot,
  FileDown,
  Medal,
  Package,
  Snowflake,
  Star,
  Ticket,
} from "lucide-react";

import type { RewardHistoryItem } from "@/types/leaderboard/leaderboard.type";

interface RewardPrizeCardProps {
  reward: RewardHistoryItem;
}

const formatDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const rewardIcons = {
  physical_gift: Package,
  physical_prize: Package,
  streak_freeze: Snowflake,
  cv_credits: Ticket,
  ai_package: Bot,
  xp: Star,
  course_access: BookOpen,
  downloadable_file: FileDown,
  certificate: Award,
  badge: Medal,
} as const;

const statusClass = (status: RewardHistoryItem["status"]) => {
  if (["delivered", "claimed", "issued"].includes(status)) {
    return "bg-secondary text-white";
  }

  if (status === "address_received") {
    return "bg-[#DDEBFF] text-[#4E7DF5]";
  }

  if (["revoked", "cancelled", "failed"].includes(status)) {
    return "bg-[#FCEBEC] text-[#B42318]";
  }

  return "bg-[#EEF3EC] text-black/55";
};

export default function RewardPrizeCard({ reward }: RewardPrizeCardProps) {
  const Icon = rewardIcons[reward.rewardType];

  const isDigital = !["physical_prize", "physical_gift"].includes(
    reward.rewardType,
  );

  return (
    <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-5">
          <div
            className={`flex size-20 items-center justify-center rounded-[1.7rem] ${
              isDigital
                ? "bg-[#75FF75] text-secondary"
                : "bg-[#DDF3F0] text-secondary"
            }`}
          >
            <Icon className="size-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black/90">{reward.title}</h2>

            {reward.subtitle && (
              <p className="mt-1 text-base text-black/55">{reward.subtitle}</p>
            )}

            <p className="mt-2 text-lg text-black/55">
              Awarded {formatDate(reward.awardedAt)}
            </p>

            {reward.primaryAmount !== null && (
              <p className="mt-2 text-sm font-semibold text-secondary">
                {reward.primaryAmount} {reward.primaryUnit || "units"}
                {reward.secondaryAmount !== null
                  ? ` • ${reward.secondaryAmount} ${
                      reward.secondaryUnit || "units"
                    }`
                  : ""}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <span
            className={`rounded-full px-5 py-2 text-sm font-bold uppercase ${statusClass(
              reward.status,
            )}`}
          >
            {reward.displayStatus}
          </span>

          {reward.dispatchDate && (
            <p className="mt-3 text-sm text-black/45">
              Dispatched {formatDate(reward.dispatchDate)}
            </p>
          )}

          {reward.trackingNumber && (
            <p className="mt-2 text-xs text-black/45">
              Tracking: {reward.trackingNumber}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
