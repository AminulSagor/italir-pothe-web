import { ArrowRight, ReceiptText } from "lucide-react";

import Card from "@/components/UI/cards/card";
import Button from "@/components/UI/buttons/button";

import TransactionStatusBadge from "./transaction-status-badge";

import { recentTransactions } from "@/mock/revenue-and-analytics/revenue-analytics.mock";

const RecentSuccessfulTransactions = () => {
  return (
    <Card rounded="3xl" padding="lg" shadow="sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#EAF6EF]">
          <ReceiptText className="size-5 text-[#006B3F]" />
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">
          Recent Successful Transactions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-separate border-spacing-y-5">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold uppercase text-[#98A29E]">
                Order ID
              </th>

              <th className="text-left text-xs font-semibold uppercase text-[#98A29E]">
                User
              </th>

              <th className="text-left text-xs font-semibold uppercase text-[#98A29E]">
                Item
              </th>

              <th className="text-left text-xs font-semibold uppercase text-[#98A29E]">
                Amount
              </th>

              <th className="text-left text-xs font-semibold uppercase text-[#98A29E]">
                Date
              </th>

              <th className="text-left text-xs font-semibold uppercase text-[#98A29E]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="text-sm font-medium text-[#202420]">
                  {transaction.orderId}
                </td>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[#EAF6EF] text-xs font-semibold text-[#006B3F]">
                      {transaction.userInitial}
                    </div>

                    <p className="text-sm font-medium text-[#202420]">
                      {transaction.userName}
                    </p>
                  </div>
                </td>

                <td className="text-sm text-[#202420]">{transaction.item}</td>

                <td className="text-sm font-semibold text-[#202420]">
                  {transaction.amount}
                </td>

                <td className="text-sm text-[#6F7673]">{transaction.date}</td>

                <td>
                  <TransactionStatusBadge status={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          variant="ghost"
          className="gap-2 text-[#006B3F] hover:bg-[#F4F7F4]"
        >
          View All Transactions
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
};

export default RecentSuccessfulTransactions;
