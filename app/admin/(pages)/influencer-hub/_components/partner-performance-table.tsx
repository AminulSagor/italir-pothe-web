import { Download, Eye, Filter, Pencil, Trash2 } from "lucide-react";
import { partnerPerformanceData } from "../../../../../mock/influencer-hub/influencer-hub.mock";

export default function PartnerPerformanceTable() {
    return (
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 px-6 py-5 lg:flex-row lg:items-center">
                <h2 className="text-xl font-bold text-deep-green">
                    Partner Performance Overview
                </h2>

                <div className="flex items-center gap-3">
                    <button className="flex h-10 items-center gap-2 rounded-full bg-[#F5FAF3] px-4 text-sm font-semibold text-black/60">
                        <Filter className="size-4" />
                        Filter
                    </button>

                    <button className="flex h-10 items-center gap-2 rounded-full bg-[#F5FAF3] px-4 text-sm font-semibold text-black/60">
                        <Download className="size-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-[#F7FAF5]">
                        <tr className="text-left text-xs font-bold uppercase text-black/45">
                            <th className="px-6 py-4">Partner</th>
                            <th className="px-6 py-4">Coupon Code</th>
                            <th className="px-6 py-4">Users Linked</th>
                            <th className="px-6 py-4">Total Sales</th>
                            <th className="px-6 py-4">Commission</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {partnerPerformanceData.map((partner) => (
                            <tr key={partner.id} className="border-t border-black/5">
                                <td className="px-6 py-5">
                                    <p className="font-bold text-black/85">
                                        {partner.partnerName}
                                    </p>
                                    <p className="mt-1 text-sm text-black/35">
                                        {partner.username}
                                    </p>
                                </td>

                                <td className="px-6 py-5">
                                    <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-secondary ring-1 ring-secondary/15">
                                        {partner.couponCode}
                                    </span>
                                </td>

                                <td className="px-6 py-5 font-bold text-black/80">
                                    {partner.usersLinked}
                                </td>

                                <td className="px-6 py-5 font-bold text-black/80">
                                    {partner.totalSales}
                                </td>

                                <td className="px-6 py-5">
                                    <p className="font-bold leading-5 text-green-600">
                                        {partner.commissionRate}
                                    </p>
                                    <p className="font-bold leading-5 text-green-600">
                                        {partner.commissionType}
                                    </p>
                                    <p className="text-sm text-black/35">
                                        {partner.commissionEarned}
                                    </p>
                                </td>

                                <td className="px-6 py-5">
                                    <div className="flex justify-end gap-5 text-black/35">
                                        <Eye className="size-4" />
                                        <Pencil className="size-4" />
                                        <Trash2 className="size-4" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col justify-between gap-4 px-6 py-5 text-sm text-black/55 lg:flex-row lg:items-center">
                <p>Showing 1-10 of 28 Partners</p>

                <div className="flex items-center gap-3">
                    <button className="text-xl text-black/60">‹</button>
                    <button className="flex size-9 items-center justify-center rounded-full bg-secondary font-bold text-white">
                        1
                    </button>
                    <button className="flex size-9 items-center justify-center rounded-full text-black/80">
                        2
                    </button>
                    <button className="flex size-9 items-center justify-center rounded-full text-black/80">
                        3
                    </button>
                    <button className="text-xl text-black/60">›</button>
                </div>
            </div>
        </section>
    );
}