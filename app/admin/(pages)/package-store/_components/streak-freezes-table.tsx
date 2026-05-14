import { Pencil, PlusCircle, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { streakFreezePackages } from "@/mock/package-store/package-store.mock";

export default function StreakFreezesTable() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#006B3F]">
            Streak Freeze Packages
          </h2>
          <p className="text-sm text-[#4F5B52]">
            Active inventory for in app microtransactions.
          </p>
        </div>

        <Button className="gap-2 bg-[#58F85F] text-[#006B3F] hover:bg-[#4EEB55]">
          <PlusCircle className="size-4" />
          Add Package
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-[#E7EEE8]">
              {[
                "PACKAGE NAME",
                "FREEZE COUNT",
                "PRICE",
                "HIGHLIGHT BADGE",
                "ACTIONS",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-4 text-left text-sm font-bold tracking-widest text-[#4F5B52]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {streakFreezePackages.map((item) => (
              <tr key={item.id} className="border-b border-[#EEF2EE]">
                <td className="px-4 py-6">
                  <p className="text-sm font-bold text-[#202420]">
                    ❄️ {item.packageName}
                  </p>
                  <p className="text-sm text-[#4F5B52]">{item.description}</p>
                </td>
                <td className="px-4 py-6 text-sm font-bold">
                  {item.freezeCount}
                </td>
                <td className="px-4 py-6 text-sm font-bold text-[#006B3F]">
                  {item.price}
                </td>
                <td className="px-4 py-6">
                  {item.badge ? (
                    <span className="rounded-full bg-[#FFF1E8] px-3 py-1 text-[10px] font-semibold text-[#FF8A00]">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="text-sm text-[#A0AAA2]">—</span>
                  )}
                </td>
                <td className="px-4 py-6">
                  <div className="flex gap-4">
                    <Pencil className="size-4 text-[#202420]" />
                    <Trash2 className="size-4 text-[#D92D20]" />
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
