import { CalendarDays, Send } from "lucide-react";

interface ScheduleCardProps {
    mode: "schedule" | "send-now";
}

export default function ScheduleCard({ mode }: ScheduleCardProps) {
    const isSendNow = mode === "send-now";

    return (
        <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:justify-between">
                <div className="flex-1">
                    <div className="inline-flex rounded-full bg-[#EEF3EC] p-1">
                        <a
                            href="/admin/notification-management/create?mode=send-now"
                            className={`rounded-full px-5 py-2 text-sm font-semibold ${isSendNow
                                ? "bg-white text-secondary shadow-sm"
                                : "text-black/70"
                                }`}
                        >
                            Send Now
                        </a>

                        <a
                            href="/admin/notification-management/create?mode=schedule"
                            className={`rounded-full px-5 py-2 text-sm font-semibold ${!isSendNow
                                ? "bg-white text-secondary shadow-sm"
                                : "text-black/70"
                                }`}
                        >
                            Schedule For Later
                        </a>
                    </div>

                    <div className="mt-6 h-px bg-black/10" />

                    {isSendNow ? (
                        <div className="mt-5">
                            <p className="text-base font-semibold text-black/75">
                                Ready to notify{" "}
                                <span className="text-secondary">1,248 students</span>
                            </p>

                            <p className="mt-1 text-xs uppercase tracking-wide text-black/35">
                                Planned for Oct 25, 09:00 AM
                            </p>

                            <button className="mt-5 flex h-12 items-center justify-center gap-3 rounded-full bg-secondary px-6 text-sm font-bold text-white shadow-lg shadow-secondary/25 transition hover:bg-deep-green">
                                <Send className="size-5" />
                                SEND NOTIFICATION NOW
                            </button>
                        </div>
                    ) : (
                        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center">
                            <div className="flex h-12 w-full max-w-[380px] items-center justify-between rounded-full bg-[#EEF3EC] px-7 text-sm text-black/75">
                                <span>10/25/2024</span>
                                <span className="h-8 w-px bg-black/15" />
                                <span>09:00 AM</span>
                            </div>

                            <button className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-secondary px-6 text-sm font-bold text-white shadow-lg shadow-secondary/25 transition hover:bg-deep-green lg:w-auto">
                                <CalendarDays className="size-6" />
                                SCHEDULE
                            </button>
                        </div>
                    )}
                </div>

                <div className="min-w-[280px] text-left xl:text-right">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/45">
                        Campaign Orchestration
                    </p>

                    {!isSendNow && (
                        <>
                            <p className="mt-12 text-base font-semibold text-black/75">
                                Ready to notify{" "}
                                <span className="text-secondary">1,248 students</span>
                            </p>

                            <p className="mt-1 text-xs uppercase tracking-wide text-black/35">
                                Planned for Oct 25, 09:00 AM
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}