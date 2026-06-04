import { Info } from "lucide-react";

import type { WebinarItem } from "@/types/webinar/webinar_type";

interface WebinarDetailsCardProps {
  webinar: WebinarItem | null;
}

const fallbackText = "Not available";

const formatWebinarDate = (dateTime?: string) => {
  if (!dateTime) return fallbackText;

  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return fallbackText;

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatWebinarTime = (dateTime?: string) => {
  if (!dateTime) return fallbackText;

  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return fallbackText;

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function WebinarDetailsCard({ webinar }: WebinarDetailsCardProps) {
  return (
    <div className="rounded-[34px] bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#FFF1E6] text-orange-500">
          <Info className="size-5" />
        </div>
        <h2 className="text-sm font-bold text-[#202420]">Webinar Details</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <InfoBox label="Start Time" value={formatWebinarTime(webinar?.dateTime)} />
        <InfoBox label="Start Date" value={formatWebinarDate(webinar?.dateTime)} />
        <InfoBox label="Host / Teacher" value={webinar?.hostTeacherName || fallbackText} />
        <InfoBox label="Audience" value={getAudienceText(webinar)} />
      </div>
    </div>
  );
}

function getAudienceText(webinar: WebinarItem | null) {
  if (!webinar?.audienceSettings) return fallbackText;

  const courseIds = webinar.audienceSettings.courseIds || [];

  if (webinar.audienceSettings.isForAllUsers || courseIds.length === 0) {
    return "All users";
  }

  return `${courseIds.length} course${courseIds.length > 1 ? "s" : ""}`;
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[136px] items-end justify-between gap-4 rounded-3xl bg-[#F1F6EE] p-5">
      <div>
        <p className="mb-7 text-[11px] font-bold uppercase tracking-wide text-[#4E5A52]">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-[#202420]">{value}</h3>
      </div>
    </div>
  );
}
