import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { recentPurchases } from "@/mock/dashboard/recent-purchases.mock";

const RecentPurchasesCard = () => {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-medium text-[#202420]">
          Recent Purchases
        </h2>

        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Export CSV
          </Button>

          <Button size="sm">All Orders</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-black/10 text-left">
              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Order ID
              </th>
              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Student Name
              </th>
              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Item Purchased
              </th>
              <th className="pb-5 text-xs font-bold uppercase text-[#3F463F]">
                Amount
              </th>
              <th className="pb-5 text-right text-xs font-bold uppercase text-[#3F463F]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {recentPurchases.map((purchase) => (
              <tr key={purchase.id}>
                <td className="py-5 text-sm font-medium text-[#007A4D]">
                  {purchase.id}
                </td>
                <td className="py-5 text-sm font-semibold text-[#202420]">
                  {purchase.studentName}
                </td>
                <td className="py-5 text-sm text-[#202420]">
                  {purchase.itemPurchased}
                </td>
                <td className="py-5 text-sm text-[#202420]">
                  {purchase.amount}
                </td>
                <td className="py-5 text-right">
                  <span className="rounded-full bg-[#E9FBEF] px-3 py-1 text-xs font-bold text-[#007A4D]">
                    {purchase.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentPurchasesCard;
