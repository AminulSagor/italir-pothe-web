import {
    CirclePlus,
    Eye,
    Filter,
    Pencil,
    Play,
    Trash2,
} from "lucide-react";
import {
    notificationHistory,
    notificationStats,
} from "../../../../mock/notification-management/notification-management.mock";

export default function NotificationManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-deep-green">
                        Notification Management
                    </h1>

                    <p className="mt-2 text-sm text-black/50">
                        Review performance and manage outgoing student communication.
                    </p>
                </div>

                <button className="flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-sm font-medium text-white transition hover:bg-deep-green">
                    <CirclePlus className="size-4" />
                    CREATE NEW
                </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                {notificationStats.map((stat, index) => (
                    <div key={stat.id} className="rounded-[2rem] bg-white p-6 shadow-sm">
                        <div
                            className={`flex size-10 items-center justify-center rounded-full ${index === 0
                                    ? "bg-emerald-100 text-secondary"
                                    : "bg-orange-100 text-orange-500"
                                }`}
                        >
                            <Play className="size-4" />
                        </div>

                        <p className="mt-4 text-xs font-medium tracking-wide text-black/40">
                            {stat.title}
                        </p>

                        <h2 className="mt-1 text-3xl font-bold text-deep-green">
                            {stat.value}
                        </h2>

                        <p
                            className={`mt-2 text-sm ${index === 0 ? "text-green-600" : "text-black/45"
                                }`}
                        >
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-black/5 px-6 py-5 lg:flex-row lg:items-center">
                    <div>
                        <h3 className="text-xl font-bold text-deep-green">
                            Notification History
                        </h3>

                        <p className="mt-1 text-sm text-black/45">
                            Monitor your communication performance
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex h-10 items-center gap-2 rounded-full bg-[#F5FAF3] px-4 text-sm font-medium text-black/60">
                            <Filter className="size-4" />
                            Filter
                        </button>

                        <button className="flex h-10 items-center gap-2 rounded-full bg-[#F5FAF3] px-4 text-sm font-medium text-black/60">
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-[#F7FAF5]">
                            <tr className="text-left text-xs font-semibold text-black/40">
                                <th className="px-6 py-4">DATE & TIME</th>
                                <th className="px-6 py-4">CAMPAIGN TITLE</th>
                                <th className="px-6 py-4">TARGET AUDIENCE</th>
                                <th className="px-6 py-4">STATUS</th>
                                <th className="px-6 py-4 text-right">ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {notificationHistory.map((item) => (
                                <tr key={item.id} className="border-t border-black/5 text-sm">
                                    <td className="px-6 py-5">
                                        <p className="font-medium text-black/80">{item.date}</p>
                                        <p className="mt-1 text-black/40">{item.time}</p>
                                    </td>

                                    <td className="px-6 py-5">
                                        <p className="max-w-[200px] font-semibold leading-6 text-deep-green">
                                            {item.title}
                                        </p>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F5FAF3] px-3 py-1 text-xs text-black/60">
                                            <span>{item.audience}</span>

                                            <span className="rounded-full bg-[#DFF6E8] px-2 py-[2px] text-secondary">
                                                {item.audienceCount}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${item.status === "completed"
                                                    ? "bg-[#E7F8EC] text-green-700"
                                                    : "bg-[#FFF1E7] text-orange-500"
                                                }`}
                                        >
                                            <span className="size-2 rounded-full bg-current" />
                                            {item.status.toUpperCase()}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-4 text-black/40">
                                            <button>
                                                <Eye className="size-4" />
                                            </button>

                                            <button>
                                                <Pencil className="size-4" />
                                            </button>

                                            <button>
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col justify-between gap-4 px-6 py-5 text-sm text-black/45 lg:flex-row lg:items-center">
                    <p>Showing 4 of 128 campaigns</p>

                    <div className="flex items-center gap-2">
                        <button className="flex size-8 items-center justify-center rounded-full border border-black/10">
                            {"<"}
                        </button>

                        <button className="flex size-8 items-center justify-center rounded-full bg-secondary text-white">
                            1
                        </button>

                        <button className="flex size-8 items-center justify-center rounded-full border border-black/10">
                            2
                        </button>

                        <button className="flex size-8 items-center justify-center rounded-full border border-black/10">
                            3
                        </button>

                        <button className="flex size-8 items-center justify-center rounded-full border border-black/10">
                            {">"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}