import { Eye, Plus } from "lucide-react";
import { payoutHistoryData } from "../../../../../../mock/influencer-hub/influencer-hub.mock";

export default function PayoutHistoryCard() {
    return (
        <section className="overflow-hidden rounded-[2rem] bg-white px-7 py-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-3 text-xl font-bold text-black/85">
                    <span className="h-8 w-1.5 rounded-full bg-[#75FF33]" />
                    Payout History
                </h2>

                <div className="flex items-center gap-4">
                    <button className="flex h-11 items-center gap-2 rounded-full bg-[#75FF33] px-7 text-sm font-bold text-deep-green">
                        <Plus className="size-4" />
                        Add Manual Entry
                    </button>

                    <button className="h-11 rounded-full border border-dashed border-black/20 px-7 text-sm font-medium text-black/70">
                        View Full Ledger
                    </button>
                </div>
            </div>

            <div className="mt-7 overflow-x-auto">
                <table className="w-full min-w-[850px]">
                    <thead>
                        <tr className="border-b border-black/10 text-left text-sm font-bold uppercase tracking-wide text-deep-green">
                            <th className="px-5 py-4">Date</th>
                            <th className="px-5 py-4">Transaction Type</th>
                            <th className="px-5 py-4">Reference ID</th>
                            <th className="px-5 py-4">Amount</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {payoutHistoryData.map((item) => (
                            <tr key={item.id} className="border-b border-black/[0.03]">
                                <td className="px-5 py-5 text-base text-black/80">
                                    {item.date}
                                </td>

                                <td className="px-5 py-5 text-base text-black/80">
                                    {item.transactionType}
                                </td>

                                <td className="px-5 py-5 text-base text-black/70">
                                    {item.referenceId}
                                </td>

                                <td className="px-5 py-5 text-base font-bold text-black/85">
                                    {item.amount}
                                </td>

                                <td className="px-5 py-5">
                                    <span
                                        className={`inline-flex rounded-full px-4 py-1 text-xs font-bold uppercase ${item.status === "paid"
                                                ? "bg-[#E7F8EC] text-green-700"
                                                : "bg-[#FFE1E1] text-red-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td className="px-5 py-5">
                                    <div className="flex justify-end">
                                        <Eye className="size-5 text-black/60" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}