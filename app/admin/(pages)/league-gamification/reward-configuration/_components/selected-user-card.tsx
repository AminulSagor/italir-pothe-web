import type { RewardConfigurationUser } from "@/types/leaderboard/leaderboard.type";

interface SelectedUserCardProps {
  user: RewardConfigurationUser;
}

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export default function SelectedUserCard({ user }: SelectedUserCardProps) {
  return (
    <section className="rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="size-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full bg-[#DDF3D9] text-lg font-bold text-secondary">
              {getInitials(user.displayName)}
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold leading-tight text-black/85">
              {user.displayName}
            </h3>

            <p className="mt-1 text-base leading-5 text-black/60">
              {user.level || "Learning level not set"}

              {user.username ? ` • @${user.username}` : ""}
            </p>

            <p className="text-base leading-5 text-black/60">
              {user.totalXp.toLocaleString()} XP
              {user.streakDays > 0 ? ` • ${user.streakDays} day streak` : ""}
            </p>
          </div>
        </div>

        <div className="flex min-w-[210px] flex-col gap-3">
          <span className="rounded-full bg-[#75FF75] px-6 py-2 text-center text-sm font-bold uppercase text-secondary">
            {user.topPercent
              ? `Top ${user.topPercent}% Learner`
              : user.rank
                ? `Rank #${user.rank}`
                : "Rank Unavailable"}
          </span>

          <span className="rounded-full bg-[#DDE3DA] px-6 py-3 text-center text-sm font-medium uppercase text-black/60">
            {user.league.name}
          </span>
        </div>
      </div>
    </section>
  );
}
