"use client";

import { useState } from "react";
import { X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type {
  StoreOrderSortBy,
  StoreSortOrder,
} from "@/types/package-store/package-store.type";

interface OrderFilterValues {
  packageType: string;
  status: string;
  paymentProvider: string;
  dateFrom: string;
  dateTo: string;
  sortBy: StoreOrderSortBy;
  sortOrder: StoreSortOrder;
}

interface OrderFilterDialogProps {
  open: boolean;
  values: OrderFilterValues;
  onClose: () => void;
  onApply: (values: OrderFilterValues) => void;
}

export default function OrderFilterDialog({
  open,
  values,
  onClose,
  onApply,
}: OrderFilterDialogProps) {
  const [draft, setDraft] = useState(values);

  const updateDraft = <Key extends keyof OrderFilterValues>(
    key: Key,
    value: OrderFilterValues[Key],
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetValues: OrderFilterValues = {
    packageType: "",
    status: "",
    paymentProvider: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
  };

  return (
    <Dialog open={open} onClose={onClose} size="lg" className="p-0">
      <div className="border-b border-[#EEF2EE] px-7 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF2EE]"
          aria-label="Close order filters"
        >
          <X className="size-4 text-[#4D574F]" />
        </button>

        <h2 className="text-xl font-bold text-[#006B3F]">
          Filter Order History
        </h2>
      </div>

      <div className="grid gap-5 px-7 py-6 sm:grid-cols-2">
        <SelectField
          label="Package Type"
          value={draft.packageType}
          onChange={(value) => updateDraft("packageType", value)}
          options={[
            { label: "All Package Types", value: "" },
            { label: "AI Bundles", value: "ai_bundle" },
            { label: "Streak Freezes", value: "streak_freeze" },
            { label: "CV Credits", value: "cv_credit" },
          ]}
        />

        <SelectField
          label="Order Status"
          value={draft.status}
          onChange={(value) => updateDraft("status", value)}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Pending", value: "pending" },
            { label: "Completed", value: "completed" },
            { label: "Failed", value: "failed" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Expired", value: "expired" },
            { label: "Refunded", value: "refunded" },
          ]}
        />

        <SelectField
          label="Payment Provider"
          value={draft.paymentProvider}
          onChange={(value) => updateDraft("paymentProvider", value)}
          options={[
            { label: "All Providers", value: "" },
            { label: "Google Play", value: "google_play" },
            { label: "App Store", value: "app_store" },
          ]}
        />

        <SelectField
          label="Sort By"
          value={draft.sortBy}
          onChange={(value) => updateDraft("sortBy", value as StoreOrderSortBy)}
          options={[
            { label: "Order Date", value: "createdAt" },
            { label: "Amount", value: "totalAmountEur" },
            { label: "Order Number", value: "orderNumber" },
          ]}
        />

        <label>
          <span className="mb-2 block text-xs font-medium text-[#5F675F]">
            DATE FROM
          </span>

          <input
            type="date"
            value={draft.dateFrom}
            onChange={(event) => updateDraft("dateFrom", event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none"
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-medium text-[#5F675F]">
            DATE TO
          </span>

          <input
            type="date"
            value={draft.dateTo}
            onChange={(event) => updateDraft("dateTo", event.target.value)}
            className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none"
          />
        </label>

        <SelectField
          label="Sort Order"
          value={draft.sortOrder}
          onChange={(value) =>
            updateDraft("sortOrder", value as StoreSortOrder)
          }
          options={[
            { label: "Descending", value: "DESC" },
            { label: "Ascending", value: "ASC" },
          ]}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F6F8F4] px-7 py-6 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setDraft(resetValues);
            onApply(resetValues);
          }}
        >
          Reset
        </Button>

        <Button onClick={() => onApply(draft)}>Apply Filters</Button>
      </div>
    </Dialog>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-medium text-[#5F675F]">
        {label.toUpperCase()}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
