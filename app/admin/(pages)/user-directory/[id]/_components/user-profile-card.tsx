import { Ban, Gift, MessageSquare, ShieldCheck, Trophy } from "lucide-react";

import type { AdminUserDetailsResponse } from "@/types/user-directory/user-directory.type";

interface UserProfileCardProps {
  user: AdminUserDetailsResponse["user"];

  onGiftReward: () => void;
  onMessage: () => void;
  onToggleRestriction: () => void;
}

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const formatJoinDate = (value: string) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
};

export default function UserProfileCard({
  user,
  onGiftReward,
  onMessage,
  onToggleRestriction,
}: UserProfileCardProps) {
  return (
    <section className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="size-[140px] rounded-[2rem] object-cover"
            />
          ) : (
            <div className="flex size-[140px] items-center justify-center rounded-[2rem] bg-[#E6F2F0] text-3xl font-bold text-secondary">
              {getInitials(user.fullName)}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-secondary">
                {user.fullName}
              </h2>

              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase ${
                  user.isRestricted
                    ? "bg-[#FCEBEC] text-[#B42318]"
                    : "bg-[#DDF3EC] text-secondary"
                }`}
              >
                {user.isRestricted ? "Restricted" : "Active"}
              </span>
            </div>

            <p className="mt-2 text-sm text-black/45">
              {user.email || "No email"}

              {user.phone ? ` • ${user.phone}` : ""}
            </p>

            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-[#F2C08C] bg-[#FFF3E7] px-5 py-3">
              <Trophy className="size-5 text-[#D86A00]" />

              <div>
                <p className="text-xs font-semibold uppercase text-[#D86A00]">
                  Total Progress
                </p>

                <p className="text-2xl font-bold text-black/90">
                  {user.totalXp.toLocaleString()} XP
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#DDF3EC] px-5 py-2 text-sm font-semibold text-secondary">
                Joined {formatJoinDate(user.joinedAt)}
              </span>

              <span className="rounded-full bg-[#EEF3EC] px-5 py-2 text-sm font-semibold text-black/55">
                {user.accessTier === "premium_pro" ? "Premium/Pro" : "Free"}
              </span>

              {user.isVerified && (
                <span className="rounded-full bg-[#E7F0FF] px-5 py-2 text-sm font-semibold text-[#3568C0]">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={onGiftReward}
            className="flex h-16 items-center justify-center gap-3 rounded-full bg-secondary px-10 text-lg font-semibold text-white shadow-lg shadow-green-900/15"
          >
            <Gift className="size-5" />
            Gift Reward
          </button>

          <button
            type="button"
            onClick={onMessage}
            className="flex h-16 items-center justify-center gap-3 rounded-full bg-[#E6F2F0] px-10 text-lg font-medium text-secondary"
          >
            <MessageSquare className="size-5" />
            Message User
          </button>

          <button
            type="button"
            onClick={onToggleRestriction}
            className={`flex h-16 items-center justify-center gap-3 rounded-full px-10 text-lg font-medium ${
              user.isRestricted
                ? "bg-[#DDF3E8] text-secondary"
                : "bg-[#DDE3DA] text-black/65"
            }`}
          >
            {user.isRestricted ? (
              <ShieldCheck className="size-5" />
            ) : (
              <Ban className="size-5" />
            )}

            {user.isRestricted ? "Unrestrict Account" : "Restrict Account"}
          </button>
        </div>
      </div>
    </section>
  );
}
