import Image from "next/image";
import { Download, Eye } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { transactionLogs } from "@/mock/package-store/package-store.mock";

const statusClasses = {
  Completed: "bg-[#DDF3E8] text-[#007A35]",
  Pending: "bg-[#FCEBEC] text-[#B42318]",
  Refunded: "bg-[#FCEBEC] text-[#D92D20]",
};

export default function OrderHistoryTable() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#006B3F]">Transaction Logs</h2>

        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr>
              {[
                "ORDER ID",
                "CUSTOMER",
                "PACKAGE",
                "DATE",
                "AMOUNT",
                "STATUS",
                "ACTIONS",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-4 text-left text-xs font-bold text-[#4F5B52]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactionLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-7 text-sm font-bold text-[#006B3F]">
                  {log.orderId}
                </td>
                <td className="px-4 py-7">
                  <div className="flex items-center gap-3">
                    <Image
                      src={log.customerAvatar}
                      alt={log.customerName}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm">{log.customerName}</span>
                  </div>
                </td>
                <td className="px-4 py-7 text-sm text-[#4F5B52]">
                  {log.packageName}
                </td>
                <td className="px-4 py-7 text-sm text-[#4F5B52]">{log.date}</td>
                <td className="px-4 py-7 text-sm font-bold">{log.amount}</td>
                <td className="px-4 py-7">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[log.status]}`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-4 py-7">
                  <div className="flex gap-3">
                    <button className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC]">
                      <Eye className="size-4" />
                    </button>
                    <button className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC]">
                      <Download className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
