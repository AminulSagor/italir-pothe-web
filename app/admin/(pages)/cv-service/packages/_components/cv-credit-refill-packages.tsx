import { Edit2, GripVertical, Infinity, PackagePlus, Ticket } from "lucide-react";

import Card from "@/components/UI/cards/card";
import { cvCreditPackages } from "@/mock/cv-service/cv-service.mock";

interface Props {
  onCreatePackage: () => void;
}

export default function CVCreditRefillPackages({ onCreatePackage }: Props) {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm" className="bg-white">
      <div className="mb-7 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#FCE8D1] text-[#C46A00]">
            <PackagePlus className="size-5" />
          </span>

          <h2 className="text-base font-bold text-[#202420]">
            CV Credit Refill Packages
          </h2>
        </div>

        <span className="rounded-full bg-[#DDF8E8] px-4 py-1 text-xs font-semibold uppercase text-[#007A4D]">
          3 Active Plans
        </span>
      </div>

      <div className="space-y-3">
        {cvCreditPackages.map((item) => (
          <div
            key={item.id}
            className={`relative flex items-center gap-4 rounded-2xl bg-[#EEF3EB] p-4 ${
              item.active ? "border border-[#00875A]" : "border border-transparent"
            }`}
          >
            {item.badge && (
              <span className="absolute right-12 top-0 rounded-b-lg bg-[#54EA54] px-4 py-1 text-[10px] font-bold uppercase text-[#007A35]">
                {item.badge}
              </span>
            )}

            <span className="flex size-10 items-center justify-center rounded-full bg-[#FFF0D9] text-[#C46A00]">
              {item.credits === 10 ? (
                <Infinity className="size-5" />
              ) : (
                <Ticket className="size-5" />
              )}
            </span>

            <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_120px] sm:items-center">
              <div>
                <p className="rounded-full bg-white px-4 py-1 text-sm font-bold text-[#202420]">
                  {item.name}
                </p>

                <p
                  className={`mt-2 text-sm ${
                    item.active ? "font-bold text-[#007A4D]" : "text-black/55"
                  }`}
                >
                  {item.credits} Credits
                </p>
              </div>

              <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
                € <span className="ml-3">{item.price}</span>
              </div>
            </div>

            <button type="button">
              <Edit2 className="size-4 text-[#007A4D]" />
            </button>

            <button type="button">
              <GripVertical className="size-4 text-black/50" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onCreatePackage}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-black/30 py-4 text-sm font-medium text-black/60"
      >
        <PackagePlus className="size-4 text-[#007A4D]" />
        Create New Sales Package
      </button>
    </Card>
  );
}