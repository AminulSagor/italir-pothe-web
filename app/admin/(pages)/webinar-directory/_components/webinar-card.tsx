"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BellRing, Pencil, Play, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import type { WebinarItem } from "@/types/webinar/webinar_type";

interface WebinarCardProps {
  webinar: WebinarItem;
  onEdit: (webinar: WebinarItem) => void;
  onDelete: (webinar: WebinarItem) => void;
}

const getAudienceBadge = (webinar: WebinarItem) => {
  const courseIds = webinar.audienceSettings?.courseIds || [];

  if (webinar.audienceSettings?.isForAllUsers || courseIds.length === 0) {
    return "ALL USERS";
  }

  return `${courseIds.length} COURSE${courseIds.length > 1 ? "S" : ""}`;
};

const formatWebinarDate = (dateTime: string) => {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return "---";

  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })
    .toUpperCase();
};

const formatWebinarTime = (dateTime: string) => {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return "--:--";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const canEnterPreLiveStudio = (webinar: WebinarItem, now: Date) => {
  if (webinar.status === "live") return true;
  if (webinar.status !== "scheduled") return false;

  const scheduledAt = new Date(webinar.dateTime).getTime();
  if (Number.isNaN(scheduledAt)) return false;

  return scheduledAt - now.getTime() <= ONE_HOUR_IN_MS;
};

const WebinarCard = ({ webinar, onEdit, onDelete }: WebinarCardProps) => {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const showPreLiveStudioButton = canEnterPreLiveStudio(webinar, now);
  const showPushReminderButton =
    webinar.status === "scheduled" && !webinar.sendNotification;

  return (
    <Card
      rounded="3xl"
      padding="lg"
      className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex gap-5">
        <div className="flex h-[92px] min-w-[92px] flex-col items-center justify-center rounded-[28px] bg-[#F1F4F0]">
          <span className="text-xs font-semibold text-[#5D635F]">
            {formatWebinarDate(webinar.dateTime)}
          </span>

          <span className="text-2xl font-bold text-[#202420]">
            {formatWebinarTime(webinar.dateTime)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-[#202420]">
              {webinar.title}
            </h3>

            <span className="rounded-full border border-[#C7E7D5] bg-[#E6F4EC] px-3 py-1 text-xs font-semibold text-[#006B3F]">
              {getAudienceBadge(webinar)}
            </span>
          </div>

          <p className="text-sm text-[#5D635F]">
            Host: {webinar.hostTeacherName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showPreLiveStudioButton && (
          <Button
            className="gap-2 px-7"
            onClick={() =>
              router.push(`/admin/webinar-directory/pre-stage?id=${webinar.id}`)
            }
          >
            <span>Enter Pre Live Studio</span>
            <Play size={16} />
          </Button>
        )}

        {showPushReminderButton && (
          <Button
            variant="ghost"
            className="gap-2 bg-[#EEF1ED] text-[#4E554F] hover:bg-[#E4E8E2]"
          >
            <BellRing size={16} />
            <span>Send Push Reminder</span>
          </Button>
        )}

        <button type="button" onClick={() => onEdit(webinar)}>
          <Pencil className="size-5 text-[#202420]" />
        </button>

        <button type="button" onClick={() => onDelete(webinar)}>
          <Trash2 className="size-5 text-[#DC2626]" />
        </button>
      </div>
    </Card>
  );
};

export default WebinarCard;
