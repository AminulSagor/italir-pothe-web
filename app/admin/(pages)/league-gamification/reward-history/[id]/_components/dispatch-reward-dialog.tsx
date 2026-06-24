"use client";

import { Loader2, Truck, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { DispatchRewardPayload } from "@/types/leaderboard/leaderboard.type";

interface DispatchRewardDialogProps {
  open: boolean;
  form: DispatchRewardPayload;
  isSubmitting: boolean;

  onChange: (form: DispatchRewardPayload) => void;

  onClose: () => void;
  onSubmit: () => void;
}

export default function DispatchRewardDialog({
  open,
  form,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: DispatchRewardDialogProps) {
  const updateField = <Key extends keyof DispatchRewardPayload>(
    key: Key,
    value: DispatchRewardPayload[Key],
  ) => {
    onChange({
      ...form,
      [key]: value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} size="md" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
          aria-label="Close dispatch dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="flex items-center gap-3 text-xl font-bold text-secondary">
          <Truck className="size-5" />
          Dispatch Reward
        </h2>
      </div>

      <div className="space-y-5 px-7 py-6">
        <TextInput
          label="Carrier Name"
          value={form.carrierName || ""}
          maxLength={160}
          disabled={isSubmitting}
          onChange={(value) => updateField("carrierName", value)}
        />

        <TextInput
          label="Tracking Number"
          value={form.trackingNumber || ""}
          maxLength={200}
          disabled={isSubmitting}
          onChange={(value) => updateField("trackingNumber", value)}
        />

        <TextInput
          label="Invoice URL"
          value={form.invoiceUrl || ""}
          maxLength={1200}
          disabled={isSubmitting}
          onChange={(value) => updateField("invoiceUrl", value)}
        />

        <div className="flex items-center justify-between rounded-full bg-[#EEF3EC] px-5 py-4">
          <p className="text-sm font-medium text-black/70">
            Send dispatch notification
          </p>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() =>
              updateField("sendNotification", !(form.sendNotification ?? true))
            }
            className={`relative h-7 w-12 rounded-full transition ${
              (form.sendNotification ?? true) ? "bg-[#5AF256]" : "bg-[#CBD4CC]"
            }`}
          >
            <span
              className={`absolute top-1 size-5 rounded-full bg-white transition ${
                (form.sendNotification ?? true) ? "right-1" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={isSubmitting} onClick={onSubmit}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Truck className="mr-2 size-4" />
          )}
          Dispatch Reward
        </Button>
      </div>
    </Dialog>
  );
}

function TextInput({
  label,
  value,
  maxLength,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  maxLength: number;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}
      </span>

      <input
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
      />
    </label>
  );
}
