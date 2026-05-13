import { Edit3, Search, Trash2 } from "lucide-react";
import { cafServiceRows } from "../../../../../mock/caf-service/caf-service.mock";

const toneClass = {
    purple: "bg-purple-100 text-rose-700",
    green: "bg-emerald-100 text-secondary",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-sky-100 text-secondary",
};

export default function ServicesDataTable() {
    return (
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 px-6 py-5 lg:flex-row lg:items-center">
                <h2 className="text-xl font-bold text-black/85">Services Data Table</h2>

                <div className="flex h-10 w-full max-w-[270px] items-center gap-3 rounded-full bg-[#EEF3EC] px-4 text-black/40">
                    <Search className="size-4" />
                    <span className="text-sm">Search services...</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                    <thead>
                        <tr className="border-b border-black/10 text-left text-xs font-bold uppercase text-black/55">
                            <th className="px-6 py-4">Icon & Color</th>
                            <th className="px-6 py-4">Service Name (EN)</th>
                            <th className="px-6 py-4">Subtitle (EN)</th>
                            <th className="px-6 py-4">Linked Page</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cafServiceRows.map((item) => {
                            const Icon = item.icon;
                            const isBuilt = item.linkedPage === "Page Built";

                            return (
                                <tr key={item.id} className="border-b border-black/5">
                                    <td className="px-6 py-5">
                                        <span
                                            className={`flex size-11 items-center justify-center rounded-full ${toneClass[item.tone]}`}
                                        >
                                            <Icon className="size-5" />
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-sm text-black/80">
                                        {item.title === "Permesso"
                                            ? "Permesso di Soggiorno"
                                            : item.title}
                                    </td>

                                    <td className="px-6 py-5 text-sm uppercase text-black/55">
                                        {item.subtitle === "In Progress"
                                            ? "Permit"
                                            : item.subtitle === "Official"
                                                ? "Official Document"
                                                : "Legal"}
                                    </td>

                                    <td className="px-6 py-5">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${isBuilt
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {item.linkedPage}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-5">
                                            <Edit3 className="size-4 text-secondary" />
                                            <Trash2 className="size-4 text-red-500" />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between px-6 py-5 text-sm text-black/50">
                <p>Showing 1–3 of 24 services</p>
                <div className="flex items-center gap-4">
                    <span>‹</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-white">
                        1
                    </span>
                    <span>2</span>
                    <span>3</span>
                    <span>›</span>
                </div>
            </div>
        </section>
    );
}