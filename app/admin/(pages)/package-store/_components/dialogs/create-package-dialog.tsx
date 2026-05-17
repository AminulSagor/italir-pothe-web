"use client";

import { useState } from "react";
import { X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

type PackageType = "ai" | "freeze";

interface Props {
  open: boolean;
  defaultType?: PackageType;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePackageDialog({
  open,
  defaultType = "ai",
  onClose,
  onSuccess,
}: Props) {
  const [type, setType] = useState<PackageType>(defaultType);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      className="overflow-hidden p-0"
    >
      <div className="border-b border-[#EEF2EE] px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF2EE]"
        >
          <X className="size-4 text-[#4D574F]" />
        </button>

        <h2 className="text-xl font-bold text-[#006B3F]">Create New Package</h2>
      </div>

      <div className="space-y-5 px-7 py-6">
        <div className="grid rounded-full bg-[#EEF3EC] p-1 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setType("ai")}
            className={`rounded-full py-3 text-sm font-semibold ${
              type === "ai" ? "bg-[#006B3F] text-white" : "text-[#4F5B52]"
            }`}
          >
            AI Bundle
          </button>

          <button
            type="button"
            onClick={() => setType("freeze")}
            className={`rounded-full py-3 text-sm font-semibold ${
              type === "freeze" ? "bg-[#006B3F] text-white" : "text-[#4F5B52]"
            }`}
          >
            Streak Freeze
          </button>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[#5F675F]">
            PACKAGE NAME
          </label>
          <input
            placeholder="e.g. Master Conversation Pack"
            className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none placeholder:text-[#B8C0BA]"
          />
        </div>

        {type === "ai" ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <InputBox label="PRICING" value="€  0.00" />
            <InputBox label="VOICE MINS" value="0" center />
            <InputBox label="TOKENS" value="0" center />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputBox label="PRICING" value="€  0.00" />
            <InputBox label="FREEZE COUNT" value="0" center />
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium text-[#5F675F]">
            MARKETING BADGE
          </label>

          <button className="h-8 w-full rounded-full border border-[#006B3F] bg-[#98F1B7] text-xs font-bold text-[#202420]">
            NONE
          </button>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Badge
              label="LIMITED TIME"
              className="bg-[#DFF3FF] text-[#006B3F]"
            />
            <Badge
              label="MOST POPULAR"
              className="bg-[#E9FCEA] text-[#006B3F]"
            />
            <Badge label="BEST VALUE" className="bg-[#FFF1E8] text-[#9C3412]" />
          </div>
        </div>

        <div className="rounded-3xl bg-[#F3F6F1] p-5">
          <p className="mb-4 text-xs font-medium text-[#5F675F]">
            COUPON CONFIGURATION
          </p>

          <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <button className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold">
              Enable Coupons
              <span className="flex h-5 w-9 items-center justify-end rounded-full bg-[#006B3F] p-1">
                <span className="size-3 rounded-full bg-white" />
              </span>
            </button>

            <input
              placeholder="⌘  ENTER COUPON CODE"
              className="h-10 rounded-full bg-[#EEF2EC] px-5 text-xs outline-none placeholder:text-[#AAB3AD]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-4 bg-[#F6F8F4] px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-[#202420]"
        >
          Cancel
        </button>

        <Button
          className="px-8"
          onClick={() => {
            onClose();
            onSuccess();
          }}
        >
          Save & Publish Package
        </Button>
      </div>
    </Dialog>
  );
}

function InputBox({
  label,
  value,
  center,
}: {
  label: string;
  value: string;
  center?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#5F675F]">
        {label}
      </label>
      <input
        defaultValue={value}
        className={`h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none ${
          center ? "text-center" : ""
        }`}
      />
    </div>
  );
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <button className={`h-8 rounded-full px-4 text-xs font-bold ${className}`}>
      {label}
    </button>
  );
}
