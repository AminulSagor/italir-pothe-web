"use client";

import { Loader2, MapPin, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { UpdateRewardShippingAddressPayload } from "@/types/leaderboard/leaderboard.type";

interface ShippingAddressDialogProps {
  open: boolean;

  form: UpdateRewardShippingAddressPayload;

  isSubmitting: boolean;

  onChange: (form: UpdateRewardShippingAddressPayload) => void;

  onClose: () => void;
  onSubmit: () => void;
}

export default function ShippingAddressDialog({
  open,
  form,
  isSubmitting,
  onChange,
  onClose,
  onSubmit,
}: ShippingAddressDialogProps) {
  const updateField = <Key extends keyof UpdateRewardShippingAddressPayload>(
    key: Key,
    value: UpdateRewardShippingAddressPayload[Key],
  ) => {
    onChange({
      ...form,
      [key]: value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} size="lg" className="p-0">
      <div className="border-b border-black/5 px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:opacity-50"
          aria-label="Close shipping address dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="flex items-center gap-3 text-xl font-bold text-secondary">
          <MapPin className="size-5" />
          Shipping Address
        </h2>
      </div>

      <div className="grid gap-5 px-7 py-6 sm:grid-cols-2">
        <TextInput
          label="Full Name"
          required
          value={form.fullName}
          maxLength={180}
          disabled={isSubmitting}
          onChange={(value) => updateField("fullName", value)}
        />

        <TextInput
          label="WhatsApp Number"
          required
          value={form.whatsappNumber}
          maxLength={50}
          disabled={isSubmitting}
          onChange={(value) => updateField("whatsappNumber", value)}
        />

        <label className="sm:col-span-2">
          <span className="mb-2 block text-xs font-bold uppercase text-black/40">
            Address Line <span className="text-[#D92D20]">*</span>
          </span>

          <textarea
            value={form.addressLine}
            maxLength={1200}
            disabled={isSubmitting}
            placeholder="Enter the complete shipping address"
            onChange={(event) => updateField("addressLine", event.target.value)}
            className="min-h-32 w-full resize-none rounded-[2rem] bg-[#EEF3EC] p-5 text-sm outline-none"
          />
        </label>

        <TextInput
          label="Country Code"
          value={form.countryCode || "IT"}
          maxLength={2}
          disabled={isSubmitting}
          onChange={(value) => updateField("countryCode", value.toUpperCase())}
        />

        <div />

        <NumberInput
          label="Latitude"
          value={form.latitude}
          min={-90}
          max={90}
          disabled={isSubmitting}
          onChange={(value) => updateField("latitude", value)}
        />

        <NumberInput
          label="Longitude"
          value={form.longitude}
          min={-180}
          max={180}
          disabled={isSubmitting}
          onChange={(value) => updateField("longitude", value)}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Cancel
        </Button>

        <Button disabled={isSubmitting} onClick={onSubmit}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Save Address
        </Button>
      </div>
    </Dialog>
  );
}

function TextInput({
  label,
  value,
  maxLength,
  required = false,
  disabled = false,
  onChange,
}: {
  label: string;
  value: string;
  maxLength: number;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}

        {required && <span className="ml-1 text-[#D92D20]">*</span>}
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

function NumberInput({
  label,
  value,
  min,
  max,
  disabled = false,
  onChange,
}: {
  label: string;
  value?: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number | undefined) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}
      </span>

      <input
        type="number"
        step="0.0000001"
        min={min}
        max={max}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value ? Number(event.target.value) : undefined)
        }
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
      />
    </label>
  );
}
