import { Pencil, PlusCircle, Trash2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import { aiBundlePackages } from "@/mock/package-store/package-store.mock";

export default function AiBundlesTable() {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#202420]">Active AI Bundles</h2>

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
                "VOICE MINS",
                "TEXT TOKENS",
                "PRICE",
                "HIGHLIGHT BADGE",
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
            {aiBundlePackages.map((item) => (
              <tr key={item.id} className="border-b border-[#EEF2EE]">
                <td className="px-4 py-6 text-sm font-bold text-[#006B3F]">
                  {item.packageName}
                </td>
                <td className="px-4 py-6 text-sm">{item.voiceMins}</td>
                <td className="px-4 py-6 text-sm">{item.textTokens}</td>
                <td className="px-4 py-6 text-sm font-bold">{item.price}</td>
                <td className="px-4 py-6">
                  {item.badge ? (
                    <span className="rounded-full border border-[#F6D878] bg-[#FFF3C6] px-3 py-1 text-[10px] text-[#D89600]">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="text-sm text-[#A0AAA2]">—</span>
                  )}
                </td>
                <td className="px-4 py-6">
                  <div className="flex gap-3">
                    <button className="flex size-9 items-center justify-center rounded-full bg-[#DDEEEE] text-[#006B3F]">
                      <Pencil className="size-4" />
                    </button>
                    <button className="flex size-9 items-center justify-center rounded-full bg-[#FFDCDD] text-[#D92D20]">
                      <Trash2 className="size-4" />
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
