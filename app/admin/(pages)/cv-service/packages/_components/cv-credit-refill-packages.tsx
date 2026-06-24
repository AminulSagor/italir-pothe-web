import {
  Edit2,
  GripVertical,
  Infinity,
  PackagePlus,
  RotateCcw,
  Ticket,
  Trash2,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { StorePackage } from "@/types/package-store/package-store.type";

interface CvCreditRefillPackagesProps {
  packages: StorePackage[];
  isLoading: boolean;
  draggedPackageId: string | null;
  onCreatePackage: () => void;
  onEditPackage: (packageId: string) => void;
  onArchivePackage: (storePackage: StorePackage) => void;
  onRestorePackage: (storePackage: StorePackage) => void;
  onDragStart: (packageId: string) => void;
  onDragEnd: () => void;
  onDrop: (packageId: string) => void;
}

const formatBadge = (value: string | null) => {
  if (!value || value === "none") return null;

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default function CVCreditRefillPackages({
  packages,
  isLoading,
  draggedPackageId,
  onCreatePackage,
  onEditPackage,
  onArchivePackage,
  onRestorePackage,
  onDragStart,
  onDragEnd,
  onDrop,
}: CvCreditRefillPackagesProps) {
  const activePackages = packages.filter(
    (item) => item.status === "published",
  ).length;

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
          {activePackages} Active Plans
        </span>
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="rounded-2xl bg-[#EEF3EB] p-6 text-center text-sm text-black/55">
            Loading CV credit packages...
          </div>
        )}

        {!isLoading && packages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/20 p-6 text-center text-sm text-black/55">
            No CV credit packages found.
          </div>
        )}

        {!isLoading &&
          packages.map((item) => {
            const badge = formatBadge(item.marketingBadge);
            const isArchived = item.status === "archived";

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => onDragStart(item.id)}
                onDragEnd={onDragEnd}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDrop(item.id)}
                className={`relative flex items-center gap-4 rounded-2xl bg-[#EEF3EB] p-4 transition ${
                  draggedPackageId === item.id ? "opacity-50" : ""
                } ${isArchived ? "opacity-70" : "border border-[#00875A]"}`}
              >
                {badge && (
                  <span className="absolute right-12 top-0 rounded-b-lg bg-[#54EA54] px-4 py-1 text-[10px] font-bold uppercase text-[#007A35]">
                    {badge}
                  </span>
                )}

                <span className="flex size-10 items-center justify-center rounded-full bg-[#FFF0D9] text-[#C46A00]">
                  {item.cvCredits >= 100 ? (
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
                        isArchived
                          ? "text-black/55"
                          : "font-bold text-[#007A4D]"
                      }`}
                    >
                      {item.cvCredits} Credits
                      {isArchived ? " • Archived" : ""}
                    </p>
                  </div>

                  <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
                    € <span className="ml-3">{item.priceEur}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onEditPackage(item.id)}
                  aria-label={`Edit ${item.name}`}
                >
                  <Edit2 className="size-4 text-[#007A4D]" />
                </button>

                {isArchived ? (
                  <button
                    type="button"
                    onClick={() => onRestorePackage(item)}
                    aria-label={`Restore ${item.name}`}
                  >
                    <RotateCcw className="size-4 text-[#007A4D]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onArchivePackage(item)}
                    aria-label={`Archive ${item.name}`}
                  >
                    <Trash2 className="size-4 text-[#D92D20]" />
                  </button>
                )}

                <button type="button" aria-label={`Reorder ${item.name}`}>
                  <GripVertical className="size-4 text-black/50" />
                </button>
              </div>
            );
          })}
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
