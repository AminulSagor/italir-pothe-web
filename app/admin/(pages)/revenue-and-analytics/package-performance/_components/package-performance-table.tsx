import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { packagePerformanceTableItems } from "@/mock/package-performance/package-performance-table.mock";

const PackagePerformanceTable = () => {
  return (
    <Card padding="none" rounded="3xl" shadow="sm" className="overflow-hidden">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-medium text-[#202420]">
          Package Performance Table
        </h2>

        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-[#E9FBEF]">
            <tr className="text-left">
              <th className="px-8 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Package Name
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Type
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Sales
              </th>
              <th className="px-6 py-5 text-xs font-bold uppercase text-[#3F463F]">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody>
            {packagePerformanceTableItems.map((item) => {
              const Icon = item.icon;

              return (
                <tr
                  key={item.id}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full ${item.iconBg}`}
                      >
                        <Icon className={`size-5 ${item.iconColor}`} />
                      </div>

                      <p className="font-medium text-[#202420]">
                        {item.packageName}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${item.badgeBg} ${item.badgeColor}`}
                    >
                      {item.type}
                    </span>
                  </td>

                  <td className="px-6 py-6 font-bold text-[#202420]">
                    {item.sales}
                  </td>

                  <td className="px-6 py-6 font-bold text-[#202420]">
                    {item.revenue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PackagePerformanceTable;
