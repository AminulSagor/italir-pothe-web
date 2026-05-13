import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { moderationQueue } from "../../../../../mock/reports-moderation/reports-moderation.mock";

const reasonClass: Record<string, string> = {
    "Inappropriate Lang.": "bg-red-50 text-red-700 border-red-100",
    "Spam Report": "bg-teal-50 text-teal-700 border-teal-100",
    Misinformation: "bg-sky-50 text-sky-700 border-sky-100",
    Harassment: "bg-red-50 text-red-700 border-red-100",
};

const statusClass = {
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    processing: "bg-green-100 text-green-700 border-green-300",
    resolved: "bg-black/5 text-black/35 border-transparent",
    banned: "bg-red-50 text-red-700 border-red-100",
};

export default function QueueDetailsCard() {
    return (
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 px-7 py-6">
                <h2 className="text-xl font-bold text-black/90">Queue Details</h2>

                <button className="flex h-11 items-center gap-2 rounded-full bg-[#EEF3EC] px-6 text-sm font-bold text-secondary">
                    <Filter className="size-4" />
                    Filter
                </button>
            </div>

            <div className="overflow-x-auto px-7">
                <table className="w-full min-w-[880px]">
                    <thead>
                        <tr className="text-left text-xs font-bold uppercase tracking-[0.12em] text-black/45">
                            <th className="px-4 py-5">Content / User</th>
                            <th className="px-4 py-5">Reason</th>
                            <th className="px-4 py-5">Reported Date</th>
                            <th className="px-4 py-5">Status</th>
                            <th className="px-4 py-5 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {moderationQueue.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-5">
                                    <div className="flex items-center gap-4">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-secondary">
                                            {item.avatar}
                                        </span>

                                        <div>
                                            <p className="font-bold leading-5 text-black/85">
                                                {item.userName}
                                            </p>
                                            <p className="text-sm leading-5 text-black/45">
                                                {item.contentType}
                                            </p>
                                            <p className="text-sm leading-5 text-black/45">
                                                {item.contentId}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-5">
                                    <span
                                        className={`inline-flex rounded-full border px-4 py-2 text-sm ${reasonClass[item.reason]}`}
                                    >
                                        {item.reason}
                                    </span>
                                </td>

                                <td className="px-4 py-5">
                                    <p className="font-medium text-black/75">{item.reportedDate}</p>
                                    <p className="text-sm text-black/40">{item.reportedTime}</p>
                                </td>

                                <td className="px-4 py-5">
                                    <span
                                        className={`inline-flex rounded-full border px-5 py-1.5 text-xs font-bold uppercase ${statusClass[item.status]}`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td className="px-4 py-5 text-center">
                                    <button
                                        className={`rounded-full px-7 py-4 text-sm font-bold ${item.status === "resolved"
                                            ? "bg-[#EEF3EC] text-black/45"
                                            : "bg-[#75FF33] text-deep-green"
                                            }`}
                                    >
                                        {item.status === "resolved"
                                            ? "View Outcome"
                                            : "Review Evidence"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mx-7 mb-6 mt-4 flex items-center justify-between rounded-full bg-[#EEF3EC] px-6 py-4 text-sm text-black/55">
                <p>Showing 4 of 124 tasks</p>

                <div className="flex items-center gap-4">
                    <button className="flex size-9 items-center justify-center rounded-full bg-white text-secondary">
                        <ChevronLeft className="size-4" />
                    </button>

                    <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-bold text-white">
                        1
                    </span>

                    <span className="font-semibold text-black/70">2</span>
                    <span className="font-semibold text-black/70">3</span>

                    <button className="flex size-9 items-center justify-center rounded-full bg-white text-secondary">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}