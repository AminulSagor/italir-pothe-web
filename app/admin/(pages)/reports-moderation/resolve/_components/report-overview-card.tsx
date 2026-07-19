import { ClipboardList, Mail, Phone, UserRound } from "lucide-react";

import type {
  ModerationReporterDetails,
  ModerationReportOverview,
} from "@/types/reports-moderation/reports-moderation.type";

interface ReportOverviewCardProps {
  overview: ModerationReportOverview;
  reporter: ModerationReporterDetails;
}

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

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ReportOverviewCard({
  overview,
  reporter,
}: ReportOverviewCardProps) {
  return (
    <section className="rounded-[2rem] bg-white p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-secondary">
          <ClipboardList className="size-5" />
        </span>

        <h2 className="text-lg font-bold text-black/90">Report Overview</h2>
      </div>

      <div className="mt-7 grid gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <p className="mb-3 text-xs font-bold uppercase text-black/35">
            Reporter
          </p>

          <div className="flex items-start gap-3">
            {reporter.avatarUrl ? (
              // Signed and user-hosted URLs are not known at build time.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={reporter.avatarUrl}
                alt={reporter.name || "Reporter"}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-secondary">
                {initials(reporter.name)}
              </span>
            )}

            <div className="min-w-0">
              <p className="font-bold text-black/85">
                {reporter.name || "Deleted user"}
              </p>

              {reporter.phone && (
                <p className="mt-1 flex items-center gap-2 break-all text-sm text-black/45">
                  <Phone className="size-4 shrink-0" />
                  {reporter.phone}
                </p>
              )}

              {reporter.email && (
                <p className="mt-1 flex items-center gap-2 break-all text-sm text-black/45">
                  <Mail className="size-4 shrink-0" />
                  {reporter.email}
                </p>
              )}

              {!reporter.phone && !reporter.email && (
                <p className="mt-1 flex items-center gap-2 text-sm text-black/45">
                  <UserRound className="size-4" />
                  Reporter profile unavailable
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase text-black/35">
            Reason
          </p>

          <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase text-red-600">
            {overview.reportReason}
          </span>

          <p className="mt-4 text-xs font-semibold uppercase text-black/35">
            Content Type
          </p>
          <p className="mt-1 text-sm font-medium capitalize text-black/65">
            {overview.contentType.replace(/[_-]+/g, " ")}
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase text-black/35">
            Submitted On
          </p>

          <p className="text-base text-black/75">
            {formatDate(overview.submittedAt)}
          </p>

          <p className="mt-4 text-xs font-semibold uppercase text-black/35">
            Case Number
          </p>
          <p className="mt-1 break-all text-sm font-medium text-secondary">
            {overview.caseNumber}
          </p>
        </div>
      </div>
    </section>
  );
}
