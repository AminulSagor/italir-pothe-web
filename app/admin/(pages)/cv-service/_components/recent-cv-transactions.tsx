import Card from "@/components/UI/cards/card";
import { cvTransactions } from "@/mock/cv-service/cv-service.mock";

const statusClasses = {
  Completed: "bg-[#E8F8EE] text-[#008542]",
  Failed: "bg-[#FCEBEC] text-[#D92D20]",
  Pending: "bg-[#ECEFE9] text-black/55",
};

export default function RecentCVTransactions() {
  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-lg font-bold text-[#202420]">
          Recent CV Transactions
        </h2>

        <button className="text-xs font-semibold text-[#007A4D]">
          VIEW ALL ›
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[#F2F6EF] text-xs font-bold uppercase text-black/70">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {cvTransactions.map((transaction) => (
              <tr key={transaction.orderId} className="border-t border-black/5">
                <td className="px-6 py-5 text-sm text-[#202420]">
                  {transaction.orderId}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#E6F6F0] text-xs font-bold text-[#006B3F]">
                      {transaction.initials}
                    </span>
                    <span className="text-sm text-[#202420]">
                      {transaction.user}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-[#202420]">
                  {transaction.packageName}
                </td>

                <td className="px-6 py-5 text-sm font-bold text-[#202420]">
                  {transaction.amount}
                </td>

                <td className="px-6 py-5 text-sm text-black/50">
                  {transaction.date}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      statusClasses[
                        transaction.status as keyof typeof statusClasses
                      ]
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
