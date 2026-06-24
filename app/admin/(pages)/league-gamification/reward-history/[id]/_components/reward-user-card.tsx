import { Mail, Phone } from "lucide-react";

import type { RewardDetailRecipient } from "@/types/leaderboard/leaderboard.type";

interface RewardUserCardProps {
  recipient: RewardDetailRecipient;
}

const getInitials = (name: string) => {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const leagueEmoji: Record<string, string> = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  diamond: "💎",
};

export default function RewardUserCard({ recipient }: RewardUserCardProps) {
  return (
    <aside className="rounded-[2.5rem] bg-white px-7 py-10 text-center shadow-xl shadow-black/5">
      <div className="relative mx-auto w-fit">
        {recipient.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipient.avatarUrl}
            alt={recipient.displayName}
            className="size-32 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="flex size-32 items-center justify-center rounded-full bg-[#DDF3D9] text-3xl font-bold text-secondary shadow-lg">
            {getInitials(recipient.displayName)}
          </div>
        )}

        <span className="absolute -bottom-2 -right-2 flex size-12 items-center justify-center rounded-full bg-[#75FF33] text-xl">
          {leagueEmoji[recipient.league.key] || "🏆"}
        </span>
      </div>

      <h2 className="mt-8 text-2xl font-bold text-black/85">
        {recipient.displayName}
      </h2>

      <span className="mt-3 inline-flex rounded-full bg-[#DDF7D7] px-5 py-2 text-xs font-bold uppercase text-[#52A447]">
        {recipient.league.name} Member
      </span>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <StatBox label="Total XP" value={recipient.totalXp.toLocaleString()} />

        <StatBox
          label="Ranking"
          value={recipient.rank ? `#${recipient.rank}` : "—"}
        />
      </div>

      <div className="mt-7 space-y-3 text-left">
        <ContactRow
          icon={<Mail className="size-5" />}
          text={recipient.email || "No email available"}
        />

        <ContactRow
          icon={<Phone className="size-5" />}
          text={recipient.phone || "No phone available"}
        />
      </div>
    </aside>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[#EEF3EC] px-4 py-5">
      <p className="text-xs font-bold uppercase text-black/45">{label}</p>

      <p className="mt-1 text-lg font-bold text-secondary">{value}</p>
    </div>
  );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-[#EEF3EC] px-5 py-4 text-black/60">
      <span className="text-black/45">{icon}</span>

      <span className="min-w-0 truncate text-sm">{text}</span>
    </div>
  );
}
