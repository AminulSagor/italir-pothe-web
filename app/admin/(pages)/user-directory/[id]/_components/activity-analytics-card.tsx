"use client";

import { useMemo, useState } from "react";
import { Flame, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { getAdminUserActivity } from "@/service/user-directory/user-directory.service";
import type { AdminUserActivityAnalyticsResponse } from "@/types/user-directory/user-directory.type";

interface ActivityAnalyticsCardProps {
  userId: string;

  initialAnalytics: AdminUserActivityAnalyticsResponse;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load activity analytics.";
};

const rangeOptions = [7, 30, 90, 365];

const formatActivityType = (value: string) => {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default function ActivityAnalyticsCard({
  userId,
  initialAnalytics,
}: ActivityAnalyticsCardProps) {
  const [analytics, setAnalytics] =
    useState<AdminUserActivityAnalyticsResponse>(initialAnalytics);

  const [days, setDays] = useState(initialAnalytics.range.days);

  const [isLoading, setIsLoading] = useState(false);

  const visibleDays = useMemo(() => {
    const maximumBars = 30;

    if (analytics.days.length <= maximumBars) {
      return analytics.days;
    }

    const step = analytics.days.length / maximumBars;

    return Array.from(
      {
        length: maximumBars,
      },
      (_, index) => {
        const start = Math.floor(index * step);

        const end = Math.max(start + 1, Math.floor((index + 1) * step));

        const segment = analytics.days.slice(start, end);

        const durationSeconds = segment.reduce(
          (total, day) => total + day.durationSeconds,
          0,
        );

        return {
          date: segment[0]?.date || "",

          durationSeconds,

          durationMinutes: Math.round(durationSeconds / 60),

          isActive: durationSeconds > 0,
        };
      },
    );
  }, [analytics.days]);

  const maxDuration = useMemo(
    () => Math.max(1, ...visibleDays.map((day) => day.durationSeconds)),
    [visibleDays],
  );

  const handleRangeChange = async (nextDays: number) => {
    if (nextDays === days) {
      return;
    }

    const previousDays = days;

    try {
      setIsLoading(true);
      setDays(nextDays);

      const response = await getAdminUserActivity(userId, {
        days: nextDays,
      });

      setAnalytics(response);
    } catch (error) {
      setDays(previousDays);

      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-green-100 text-secondary">
            <Flame className="size-5" />
          </span>

          <div>
            <h2 className="text-lg font-semibold text-black/90">
              Activity Analytics
            </h2>

            <p className="mt-1 text-sm text-black/40">
              {analytics.range.startDate} to {analytics.range.endDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {rangeOptions.map((option) => (
            <button
              key={option}
              type="button"
              disabled={isLoading}
              onClick={() => void handleRangeChange(option)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                days === option
                  ? "bg-secondary text-white"
                  : "bg-[#EEF3EC] text-black/55"
              }`}
            >
              {option} Days
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Current Streak"
          value={`${analytics.currentStreakDays} Days`}
        />

        <Metric
          label="Longest Streak"
          value={`${analytics.longestStreakDays} Days`}
        />

        <Metric label="Lifetime Hours" value={`${analytics.totalHours} hrs`} />

        <Metric
          label="Range Hours"
          value={`${analytics.rangeTotalHours} hrs`}
        />
      </div>

      <div className="relative mt-10">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[2rem] bg-white/70">
            <Loader2 className="size-7 animate-spin text-secondary" />
          </div>
        )}

        <div className="flex h-[220px] items-end gap-1.5 overflow-hidden rounded-[2rem] bg-[#F8FBF7] px-7 pb-6 pt-10">
          {visibleDays.map((day) => {
            const height = Math.max(
              day.isActive ? 8 : 3,

              (day.durationSeconds / maxDuration) * 150,
            );

            return (
              <div
                key={day.date}
                title={`${day.date}: ${day.durationMinutes} minutes`}
                className={`relative flex-1 rounded-t-full ${
                  day.isActive
                    ? "border-t-2 border-secondary bg-[#AEEF9C]"
                    : "bg-[#DCEBE8]"
                }`}
                style={{
                  height: `${height}px`,
                }}
              />
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-semibold text-black/40">
          <span>{analytics.range.startDate}</span>

          <span>{analytics.activeDays} Active Days</span>

          <span>{analytics.range.endDate}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {analytics.activityTypeBreakdown.map((item) => (
          <div
            key={item.activityType}
            className="rounded-[1.5rem] bg-[#EEF3EC] px-5 py-4"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-black/70">
                {formatActivityType(item.activityType)}
              </p>

              <span className="text-xs font-bold text-secondary">
                {item.percentage}%
              </span>
            </div>

            <p className="mt-2 text-xs text-black/40">
              {item.durationMinutes.toLocaleString()} minutes
            </p>
          </div>
        ))}

        {!analytics.activityTypeBreakdown.length && (
          <p className="text-sm text-black/40">
            No activity breakdown is available for this period.
          </p>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[#F8FBF7] px-5 py-4">
      <p className="text-xs font-semibold uppercase text-black/35">{label}</p>

      <h3 className="mt-1 text-xl font-bold text-secondary">{value}</h3>
    </div>
  );
}
