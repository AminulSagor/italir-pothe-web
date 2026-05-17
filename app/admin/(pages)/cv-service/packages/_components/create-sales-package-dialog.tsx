import { Rocket, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface Props {
  open: boolean;
  onClose: () => void;
}

const badges = ["None", "Best Value", "Most Popular", "Limited Time"];

export default function CreateSalesPackageDialog({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#DCEBE2]/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[680px] rounded-[32px] bg-white p-8 shadow-2xl sm:p-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-8 top-8 flex size-10 items-center justify-center rounded-full bg-[#EEF3EB] text-black/60"
        >
          <X className="size-5" />
        </button>

        <span className="rounded-full bg-[#DDF8D5] px-4 py-1 text-xs font-bold uppercase text-[#008542]">
          Manager Suite
        </span>

        <h2 className="mt-4 text-3xl font-bold text-[#006B3F]">
          Create New Sales Package
        </h2>

        <p className="mt-2 max-w-[440px] text-sm leading-6 text-black/55">
          Configure pricing details and marketing visibility for your new CV
          package offering.
        </p>

        <div className="mt-9 grid gap-8 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#202420]">
              Package Name
            </label>
            <input
              placeholder="e.g., Starter Pack"
              className="h-12 w-full rounded-full bg-[#EEF3EB] px-5 text-sm outline-none placeholder:text-black/25"
            />

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#202420]">
                  Credit Count
                </label>
                <input
                  placeholder="10"
                  className="h-12 w-full rounded-full bg-[#EEF3EB] px-5 text-sm outline-none placeholder:text-black/35"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#202420]">
                  Price (€)
                </label>
                <input
                  placeholder="29.99"
                  className="h-12 w-full rounded-full bg-[#EEF3EB] px-5 text-sm outline-none placeholder:text-black/35"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#202420]">
              Marketing Badge
            </label>

            <div className="grid grid-cols-2 gap-2">
              {badges.map((badge) => (
                <button
                  key={badge}
                  type="button"
                  className={`h-11 rounded-full border px-4 text-xs font-semibold uppercase ${
                    badge === "Best Value"
                      ? "border-[#54EA54] text-[#00A73C]"
                      : "border-black/10 text-black/45"
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 flex items-center justify-between gap-4">
          <button type="button" onClick={onClose} className="text-sm font-medium">
            Cancel
          </button>

          <Button rounded="full" size="lg" className="min-w-[260px] shadow-lg">
            Create & Publish Package
            <Rocket className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}