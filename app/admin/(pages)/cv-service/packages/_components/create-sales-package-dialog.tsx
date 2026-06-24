"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Rocket, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import type {
  CreateStorePackagePayload,
  StoreMarketingBadge,
  StorePackage,
  UpdateStorePackagePayload,
} from "@/types/package-store/package-store.type";

interface CreateSalesPackageDialogProps {
  open: boolean;
  initialPackage: StorePackage | null;
  isSubmitting: boolean;
  onClose: () => void;
  onDirtyChange: (dirty: boolean) => void;
  onCreate: (payload: CreateStorePackagePayload) => Promise<void>;
  onUpdate: (
    packageId: string,
    payload: UpdateStorePackagePayload,
  ) => Promise<void>;
}

interface FormState {
  name: string;
  credits: string;
  priceEur: string;
  marketingBadge: StoreMarketingBadge;
}

const badges: Array<{
  label: string;
  value: StoreMarketingBadge;
}> = [
  { label: "None", value: "none" },
  { label: "Best Value", value: "best_value" },
  { label: "Most Popular", value: "most_popular" },
  { label: "Limited Time", value: "limited_time" },
];

const getInitialForm = (initialPackage: StorePackage | null): FormState => ({
  name: initialPackage?.name || "",
  credits: initialPackage ? String(initialPackage.cvCredits) : "",
  priceEur: initialPackage?.priceEur || "",
  marketingBadge: initialPackage?.marketingBadge || "none",
});

export default function CreateSalesPackageDialog({
  open,
  initialPackage,
  isSubmitting,
  onClose,
  onDirtyChange,
  onCreate,
  onUpdate,
}: CreateSalesPackageDialogProps) {
  const [form, setForm] = useState<FormState>(() =>
    getInitialForm(initialPackage),
  );
  const [validationError, setValidationError] = useState("");

  const initialForm = useMemo(
    () => getInitialForm(initialPackage),
    [initialPackage],
  );

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  useEffect(() => {
    onDirtyChange(open && isDirty);
  }, [isDirty, onDirtyChange, open]);

  if (!open) return null;

  const updateForm = <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const credits = Number(form.credits);
    const price = Number(form.priceEur);

    if (!form.name.trim()) {
      setValidationError("Package name is required.");
      return;
    }

    if (!Number.isInteger(credits) || credits < 1) {
      setValidationError("Credit count must be a positive whole number.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setValidationError("Enter a valid package price.");
      return;
    }

    setValidationError("");

    if (initialPackage) {
      await onUpdate(initialPackage.id, {
        name: form.name.trim(),
        priceEur: price.toFixed(2),
        cvCreditCount: credits,
        marketingBadge: form.marketingBadge,
      });
      return;
    }

    await onCreate({
      packageType: "cv_credit",
      name: form.name.trim(),
      priceEur: price.toFixed(2),
      billingModel: "one_time",
      cvCreditCount: credits,
      marketingBadge: form.marketingBadge,
      couponsEnabled: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#DCEBE2]/80 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[680px] rounded-[32px] bg-white p-8 shadow-2xl sm:p-12">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-8 top-8 flex size-10 items-center justify-center rounded-full bg-[#EEF3EB] text-black/60 disabled:opacity-60"
          aria-label="Close package dialog"
        >
          <X className="size-5" />
        </button>

        <span className="rounded-full bg-[#DDF8D5] px-4 py-1 text-xs font-bold uppercase text-[#008542]">
          Manager Suite
        </span>

        <h2 className="mt-4 text-3xl font-bold text-[#006B3F]">
          {initialPackage ? "Edit Sales Package" : "Create New Sales Package"}
        </h2>

        <p className="mt-2 max-w-[440px] text-sm leading-6 text-black/55">
          Configure pricing details and marketing visibility for your CV package
          offering.
        </p>

        <div className="mt-9 grid gap-8 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-[#202420]">
              Package Name
            </label>
            <input
              value={form.name}
              disabled={isSubmitting}
              onChange={(event) => updateForm("name", event.target.value)}
              placeholder="e.g., Starter Pack"
              className="h-12 w-full rounded-full bg-[#EEF3EB] px-5 text-sm outline-none placeholder:text-black/25"
            />

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#202420]">
                  Credit Count
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.credits}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    updateForm("credits", event.target.value)
                  }
                  placeholder="10"
                  className="h-12 w-full rounded-full bg-[#EEF3EB] px-5 text-sm outline-none placeholder:text-black/35"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#202420]">
                  Price (€)
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.priceEur}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    updateForm("priceEur", event.target.value)
                  }
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
              {badges.map((badge) => {
                const selected = form.marketingBadge === badge.value;

                return (
                  <button
                    key={badge.value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => updateForm("marketingBadge", badge.value)}
                    className={`h-11 rounded-full border px-4 text-xs font-semibold uppercase ${
                      selected
                        ? "border-[#54EA54] bg-[#F0FFF1] text-[#00A73C]"
                        : "border-black/10 text-black/45"
                    }`}
                  >
                    {badge.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {validationError && (
          <p className="mt-6 text-sm font-medium text-[#D92D20]">
            {validationError}
          </p>
        )}

        <div className="mt-24 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="text-sm font-medium disabled:opacity-60"
          >
            Cancel
          </button>

          <Button
            rounded="full"
            size="lg"
            className="min-w-[260px] shadow-lg"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Rocket className="size-4" />
            )}
            {isSubmitting
              ? "Saving Package..."
              : initialPackage
                ? "Save Package"
                : "Create & Publish Package"}
          </Button>
        </div>
      </div>
    </div>
  );
}
