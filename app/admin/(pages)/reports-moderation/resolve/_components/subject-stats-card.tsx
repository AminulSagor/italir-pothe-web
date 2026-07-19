import { BookOpen, UserRound } from "lucide-react";

import type {
  ModerationSubjectCourse,
  ModerationSubjectStats,
} from "@/types/reports-moderation/reports-moderation.type";

interface SubjectStatsCardProps {
  subject: ModerationSubjectStats;
  courses: ModerationSubjectCourse[];
}

const formatJoinedDate = (value: string | null) => {
  if (!value) return "Unknown join date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `Member since ${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  })}`;
};

const initials = (name: string | null) => {
  const normalized = name?.trim();
  if (!normalized) return "U";

  return normalized
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

export default function SubjectStatsCard({
  subject,
  courses,
}: SubjectStatsCardProps) {
  return (
    <section className="rounded-[2rem] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-orange-50 text-secondary">
          <UserRound className="size-5" />
        </span>

        <h2 className="text-lg font-bold text-black/90">Reported User</h2>
      </div>

      <div className="mt-7 flex items-center gap-4">
        {subject.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={subject.avatarUrl}
            alt={subject.name || "Reported user"}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-bold text-secondary">
            {initials(subject.name)}
          </span>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-xl font-bold text-black/90">
              {subject.name || "Deleted user"}
            </h3>
            {subject.is_banned && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold uppercase text-red-700">
                Banned
              </span>
            )}
          </div>
          <p className="text-sm leading-5 text-black/45">
            {formatJoinedDate(subject.joinedAt)}
          </p>
          {subject.email && (
            <p className="mt-1 break-all text-xs text-black/40">{subject.email}</p>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <StatPill
          label="Streak"
          value={`${subject.current_streak_days.toLocaleString()} Days`}
        />
        <StatPill label="Total XP" value={subject.total_xp.toLocaleString()} />
        <StatPill
          label="Purchase Value"
          value={`€${Number(subject.purchase_value_eur || 0).toFixed(2)}`}
        />
        <StatPill label="Courses" value={courses.length.toLocaleString()} />
      </div>

      <div className="mt-7 rounded-[2rem] bg-[#EEF3EC] p-5">
        <p className="mb-4 text-xs font-semibold uppercase text-black/35">
          Course Enrollment
        </p>

        {courses.length === 0 ? (
          <p className="text-sm text-black/45">No course enrollment found.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={`${course.courseId}-${course.status}`}
                className="flex items-center gap-3 rounded-2xl bg-white/70 p-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                  <BookOpen className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold leading-5 text-black/85">
                    {course.title || "Deleted course"}
                  </p>
                  <p className="text-xs uppercase text-black/35">
                    {course.status.replace(/[_-]+/g, " ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[#EEF3EC] p-5 text-center">
      <p className="text-xs font-semibold uppercase text-black/35">{label}</p>
      <p className="mt-2 text-lg font-bold text-secondary">{value}</p>
    </div>
  );
}
