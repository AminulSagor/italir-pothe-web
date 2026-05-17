import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { masterSalesItems } from "@/mock/course-performance/master-sales-table.mock";

const MasterSalesTable = () => {
  return (
    <Card padding="none" rounded="3xl" className="overflow-hidden">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#006B3F]">
            Master Sales Table
          </h2>
          <p className="text-sm text-black/60">
            Real-time enrollment tracking and revenue breakdown.
          </p>
        </div>

        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-[#E9FBEF]">
            <tr className="text-left">
              <th className="px-10 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Course Name
              </th>
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Enrollments
              </th>
              <th className="px-6 py-6 text-sm font-bold uppercase text-[#3F463F]">
                Revenue
              </th>
            </tr>
          </thead>

          <tbody>
            {masterSalesItems.map((item) => (
              <tr key={item.id} className="border-b border-black/5">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-[#DFF3F4]">
                      <BookOpen className="size-5 text-[#006B3F]" />
                    </div>

                    <div>
                      <p className="font-semibold text-[#202420]">
                        {item.courseName}
                      </p>
                      <p className="text-sm text-black/40">{item.lastSale}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-6 font-medium">{item.enrollments}</td>
                <td className="px-6 py-6 font-medium">{item.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-black/60">Showing 1 to 10 of 42 courses</p>

        <div className="flex items-center gap-2">
          <button className="flex size-9 items-center justify-center rounded-full border border-black/15">
            <ChevronLeft className="size-4" />
          </button>

          <button className="size-9 rounded-full bg-[#006B3F] font-semibold text-white">
            1
          </button>
          <button className="size-9 rounded-full border border-black/15 font-semibold">
            2
          </button>
          <button className="size-9 rounded-full border border-black/15 font-semibold">
            3
          </button>

          <button className="flex size-9 items-center justify-center rounded-full border border-black/15">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MasterSalesTable;
