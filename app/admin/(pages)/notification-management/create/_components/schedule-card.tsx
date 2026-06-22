import {
  CalendarClock,
  Loader2,
  Send,
} from "lucide-react";

export type DeliveryMode =
  | "send_now"
  | "schedule_later";

interface ScheduleCardProps {
  audienceLabel: string;
  mode: DeliveryMode;
  scheduledAt: string;
  isSubmitting: boolean;
  minimumScheduledAt: string;
  onModeChange: (mode: DeliveryMode) => void;
  onScheduledAtChange: (value: string) => void;
  onSubmit: () => void;
}

export default function ScheduleCard({
  audienceLabel,
  mode,
  scheduledAt,
  isSubmitting,
  minimumScheduledAt,
  onModeChange,
  onScheduledAtChange,
  onSubmit,
}: ScheduleCardProps) {
  const isScheduleMode =
    mode === "schedule_later";

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
        <div className="flex-1">
          <div className="inline-flex rounded-full bg-[#EEF3EC] p-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                onModeChange("send_now")
              }
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                mode === "send_now"
                  ? "bg-white text-secondary shadow-sm"
                  : "text-black/40 hover:text-secondary"
              }`}
            >
              Send Now
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                onModeChange("schedule_later")
              }
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isScheduleMode
                  ? "bg-white text-secondary shadow-sm"
                  : "text-black/40 hover:text-secondary"
              }`}
            >
              Schedule For Later
            </button>
          </div>

          <div className="mt-6 h-px bg-black/10" />

          <div className="mt-5">
            <p className="text-base font-semibold text-black/75">
              {isScheduleMode
                ? "Schedule notification for "
                : "Ready to notify "}

              <span className="text-secondary">
                {audienceLabel}
              </span>
            </p>

            <p className="mt-1 text-xs uppercase tracking-wide text-black/35">
              {isScheduleMode
                ? "Notification will be sent at the selected date and time"
                : "Notification will be sent immediately"}
            </p>

            {isScheduleMode && (
              <div className="mt-5 max-w-md">
                <label
                  htmlFor="notification-scheduled-at"
                  className="mb-2 block text-sm font-semibold text-black/65"
                >
                  Delivery date and time
                </label>

                <div className="flex h-12 items-center gap-3 rounded-full bg-[#EEF3EC] px-5">
                  <CalendarClock className="size-5 shrink-0 text-secondary" />

                  <input
                    id="notification-scheduled-at"
                    type="datetime-local"
                    value={scheduledAt}
                    min={minimumScheduledAt}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      onScheduledAtChange(
                        event.target.value,
                      )
                    }
                    className="w-full bg-transparent text-sm text-black/70 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-black/40">
                  The selected time uses your current
                  browser timezone.
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onSubmit}
              className="mt-5 flex h-12 items-center justify-center gap-3 rounded-full bg-secondary px-6 text-sm font-bold text-white shadow-lg shadow-secondary/25 transition hover:bg-deep-green disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : isScheduleMode ? (
                <CalendarClock className="size-5" />
              ) : (
                <Send className="size-5" />
              )}

              {isSubmitting
                ? isScheduleMode
                  ? "SCHEDULING..."
                  : "SENDING..."
                : isScheduleMode
                  ? "SCHEDULE NOTIFICATION"
                  : "SEND NOTIFICATION NOW"}
            </button>
          </div>
        </div>

        <div className="min-w-[280px] text-left xl:text-right">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/45">
            Campaign Orchestration
          </p>
        </div>
      </div>
    </section>
  );
}

