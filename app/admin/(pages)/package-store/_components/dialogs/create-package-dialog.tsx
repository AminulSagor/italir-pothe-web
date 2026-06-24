"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type {
  CreateStorePackagePayload,
  StoreMarketingBadge,
  StorePackage,
  StorePackageType,
  StreakProtectionMode,
  UpdateStorePackagePayload,
} from "@/types/package-store/package-store.type";

interface Props {
  open: boolean;
  defaultType: StorePackageType;
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

interface PackageFormState {
  packageType: StorePackageType;
  name: string;
  priceEur: string;
  voiceMinutes: string;
  textTokens: string;
  freezeCount: string;
  cvCreditCount: string;
  streakProtectionMode: StreakProtectionMode;
  protectionDurationDays: string;
  marketingBadge: StoreMarketingBadge;
  couponsEnabled: boolean;
  couponCode: string;
}

const getInitialForm = (
  defaultType: StorePackageType,
  initialPackage: StorePackage | null,
): PackageFormState => ({
  packageType: initialPackage?.type || defaultType,
  name: initialPackage?.name || "",
  priceEur: initialPackage?.priceEur || "",
  voiceMinutes: initialPackage
    ? String(initialPackage.aiVoiceMinutes || "")
    : "",
  textTokens: initialPackage ? String(initialPackage.aiTextTokens || "") : "",
  freezeCount: initialPackage
    ? String(initialPackage.streakFreezeCount || "")
    : "",
  cvCreditCount: initialPackage ? String(initialPackage.cvCredits || "") : "",
  streakProtectionMode: initialPackage?.streakProtectionMode || "finite",
  protectionDurationDays: initialPackage?.protectionDurationDays
    ? String(initialPackage.protectionDurationDays)
    : "30",
  marketingBadge: initialPackage?.marketingBadge || "none",
  couponsEnabled: initialPackage?.couponEnabled || false,
  couponCode: initialPackage?.couponCode || "",
});

const typeOptions: Array<{
  label: string;
  value: StorePackageType;
}> = [
  { label: "AI Bundle", value: "ai_bundle" },
  { label: "Streak Freeze", value: "streak_freeze" },
  { label: "CV Credits", value: "cv_credit" },
];

const badgeOptions: Array<{
  label: string;
  value: StoreMarketingBadge;
  className: string;
}> = [
  { label: "NONE", value: "none", className: "bg-[#98F1B7] text-[#202420]" },
  {
    label: "LIMITED TIME",
    value: "limited_time",
    className: "bg-[#DFF3FF] text-[#006B3F]",
  },
  {
    label: "MOST POPULAR",
    value: "most_popular",
    className: "bg-[#E9FCEA] text-[#006B3F]",
  },
  {
    label: "BEST VALUE",
    value: "best_value",
    className: "bg-[#FFF1E8] text-[#9C3412]",
  },
];

const toPositiveInteger = (value: string) => {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
};

export default function CreatePackageDialog({
  open,
  defaultType,
  initialPackage,
  isSubmitting,
  onClose,
  onDirtyChange,
  onCreate,
  onUpdate,
}: Props) {
  const initialForm = useMemo(
    () => getInitialForm(defaultType, initialPackage),
    [defaultType, initialPackage],
  );
  const [form, setForm] = useState<PackageFormState>(initialForm);
  const [validationError, setValidationError] = useState("");

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialForm);

  useEffect(() => {
    onDirtyChange(open && isDirty);
  }, [isDirty, onDirtyChange, open]);

  const updateForm = <Key extends keyof PackageFormState>(
    key: Key,
    value: PackageFormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const price = Number(form.priceEur);

    if (!form.name.trim()) {
      setValidationError("Package name is required.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setValidationError("Enter a valid price.");
      return;
    }

    const commonPayload = {
      name: form.name.trim(),
      priceEur: price.toFixed(2),
      marketingBadge: form.marketingBadge,
      couponsEnabled: form.couponsEnabled,
      couponCode: form.couponsEnabled
        ? form.couponCode.trim().toUpperCase()
        : null,
    };

    if (form.couponsEnabled && !form.couponCode.trim()) {
      setValidationError("Coupon code is required when coupons are enabled.");
      return;
    }

    if (form.packageType === "ai_bundle") {
      const voiceMinutes = toPositiveInteger(form.voiceMinutes);
      const textTokens = toPositiveInteger(form.textTokens);

      if (!voiceMinutes || !textTokens) {
        setValidationError(
          "AI bundles require positive voice minutes and text tokens.",
        );
        return;
      }

      setValidationError("");

      if (initialPackage) {
        await onUpdate(initialPackage.id, {
          ...commonPayload,
          couponCode: commonPayload.couponCode,
          billingModel: "one_time",
          voiceMinutes,
          textTokens,
        });
      } else {
        await onCreate({
          ...commonPayload,
          couponCode: commonPayload.couponCode || undefined,
          packageType: "ai_bundle",
          billingModel: "one_time",
          voiceMinutes,
          textTokens,
        });
      }

      return;
    }

    if (form.packageType === "cv_credit") {
      const cvCreditCount = toPositiveInteger(form.cvCreditCount);

      if (!cvCreditCount) {
        setValidationError(
          "CV credit packages require a positive credit count.",
        );
        return;
      }

      setValidationError("");

      if (initialPackage) {
        await onUpdate(initialPackage.id, {
          ...commonPayload,
          couponCode: commonPayload.couponCode,
          billingModel: "one_time",
          cvCreditCount,
        });
      } else {
        await onCreate({
          ...commonPayload,
          couponCode: commonPayload.couponCode || undefined,
          packageType: "cv_credit",
          billingModel: "one_time",
          cvCreditCount,
        });
      }

      return;
    }

    if (form.streakProtectionMode === "finite") {
      const freezeCount = toPositiveInteger(form.freezeCount);

      if (!freezeCount) {
        setValidationError("Finite streak packages require a freeze count.");
        return;
      }

      setValidationError("");

      if (initialPackage) {
        await onUpdate(initialPackage.id, {
          ...commonPayload,
          couponCode: commonPayload.couponCode,
          billingModel: "one_time",
          streakProtectionMode: "finite",
          freezeCount,
          protectionDurationDays: null,
        });
      } else {
        await onCreate({
          ...commonPayload,
          couponCode: commonPayload.couponCode || undefined,
          packageType: "streak_freeze",
          billingModel: "one_time",
          streakProtectionMode: "finite",
          freezeCount,
        });
      }

      return;
    }

    const protectionDurationDays = toPositiveInteger(
      form.protectionDurationDays,
    );

    if (!protectionDurationDays || protectionDurationDays > 365) {
      setValidationError("Protection duration must be between 1 and 365 days.");
      return;
    }

    setValidationError("");

    if (initialPackage) {
      await onUpdate(initialPackage.id, {
        ...commonPayload,
        couponCode: commonPayload.couponCode,
        billingModel: "monthly",
        streakProtectionMode: "monthly_unlimited",
        protectionDurationDays,
      });
    } else {
      await onCreate({
        ...commonPayload,
        couponCode: commonPayload.couponCode || undefined,
        packageType: "streak_freeze",
        billingModel: "monthly",
        streakProtectionMode: "monthly_unlimited",
        protectionDurationDays,
      });
    }
  };

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
          disabled={isSubmitting}
          className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF2EE] disabled:opacity-60"
          aria-label="Close package dialog"
        >
          <X className="size-4 text-[#4D574F]" />
        </button>

        <h2 className="text-xl font-bold text-[#006B3F]">
          {initialPackage ? "Edit Package" : "Create New Package"}
        </h2>
      </div>

      <div className="space-y-5 px-7 py-6">
        <div className="grid rounded-full bg-[#EEF3EC] p-1 sm:grid-cols-3">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={Boolean(initialPackage) || isSubmitting}
              onClick={() => updateForm("packageType", option.value)}
              className={`rounded-full py-3 text-sm font-semibold ${
                form.packageType === option.value
                  ? "bg-[#006B3F] text-white"
                  : "text-[#4F5B52]"
              } disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-[#5F675F]">
            PACKAGE NAME
          </label>
          <input
            value={form.name}
            disabled={isSubmitting}
            onChange={(event) => updateForm("name", event.target.value)}
            placeholder="e.g. Master Conversation Pack"
            className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none placeholder:text-[#B8C0BA]"
          />
        </div>

        {form.packageType === "ai_bundle" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <InputBox
              label="PRICING"
              value={form.priceEur}
              onChange={(value) => updateForm("priceEur", value)}
              disabled={isSubmitting}
            />
            <InputBox
              label="VOICE MINS"
              value={form.voiceMinutes}
              onChange={(value) => updateForm("voiceMinutes", value)}
              disabled={isSubmitting}
              center
            />
            <InputBox
              label="TOKENS"
              value={form.textTokens}
              onChange={(value) => updateForm("textTokens", value)}
              disabled={isSubmitting}
              center
            />
          </div>
        )}

        {form.packageType === "cv_credit" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputBox
              label="PRICING"
              value={form.priceEur}
              onChange={(value) => updateForm("priceEur", value)}
              disabled={isSubmitting}
            />
            <InputBox
              label="CV CREDIT COUNT"
              value={form.cvCreditCount}
              onChange={(value) => updateForm("cvCreditCount", value)}
              disabled={isSubmitting}
              center
            />
          </div>
        )}

        {form.packageType === "streak_freeze" && (
          <>
            <div className="grid rounded-full bg-[#EEF3EC] p-1 sm:grid-cols-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => updateForm("streakProtectionMode", "finite")}
                className={`rounded-full py-3 text-sm font-semibold ${
                  form.streakProtectionMode === "finite"
                    ? "bg-[#006B3F] text-white"
                    : "text-[#4F5B52]"
                }`}
              >
                Finite Freezes
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  updateForm("streakProtectionMode", "monthly_unlimited")
                }
                className={`rounded-full py-3 text-sm font-semibold ${
                  form.streakProtectionMode === "monthly_unlimited"
                    ? "bg-[#006B3F] text-white"
                    : "text-[#4F5B52]"
                }`}
              >
                Monthly Unlimited
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputBox
                label="PRICING"
                value={form.priceEur}
                onChange={(value) => updateForm("priceEur", value)}
                disabled={isSubmitting}
              />

              {form.streakProtectionMode === "finite" ? (
                <InputBox
                  label="FREEZE COUNT"
                  value={form.freezeCount}
                  onChange={(value) => updateForm("freezeCount", value)}
                  disabled={isSubmitting}
                  center
                />
              ) : (
                <InputBox
                  label="PROTECTION DAYS"
                  value={form.protectionDurationDays}
                  onChange={(value) =>
                    updateForm("protectionDurationDays", value)
                  }
                  disabled={isSubmitting}
                  center
                />
              )}
            </div>
          </>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium text-[#5F675F]">
            MARKETING BADGE
          </label>

          <div className="grid gap-3 sm:grid-cols-4">
            {badgeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isSubmitting}
                onClick={() => updateForm("marketingBadge", option.value)}
                className={`h-8 rounded-full border px-3 text-[10px] font-bold ${
                  form.marketingBadge === option.value
                    ? `border-[#006B3F] ${option.className}`
                    : "border-transparent bg-[#EEF2EC] text-[#5F675F]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#F3F6F1] p-5">
          <p className="mb-4 text-xs font-medium text-[#5F675F]">
            COUPON CONFIGURATION
          </p>

          <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateForm("couponsEnabled", !form.couponsEnabled)}
              className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold"
            >
              Enable Coupons
              <span
                className={`flex h-5 w-9 items-center rounded-full p-1 ${
                  form.couponsEnabled
                    ? "justify-end bg-[#006B3F]"
                    : "justify-start bg-[#CCD4CE]"
                }`}
              >
                <span className="size-3 rounded-full bg-white" />
              </span>
            </button>

            <input
              value={form.couponCode}
              disabled={!form.couponsEnabled || isSubmitting}
              onChange={(event) =>
                updateForm("couponCode", event.target.value.toUpperCase())
              }
              placeholder="ENTER COUPON CODE, E.G. SAVE20"
              className="h-10 rounded-full bg-[#EEF2EC] px-5 text-xs outline-none placeholder:text-[#AAB3AD] disabled:opacity-60"
            />
          </div>

          <p className="mt-2 text-[10px] text-[#7B847D]">
            Coupon codes must end with a two-digit discount percentage.
          </p>
        </div>

        {validationError && (
          <p className="text-sm font-medium text-[#D92D20]">
            {validationError}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-4 bg-[#F6F8F4] px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="text-sm text-[#202420] disabled:opacity-60"
        >
          Cancel
        </button>

        <Button className="px-8" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isSubmitting
            ? "Saving..."
            : initialPackage
              ? "Save Package"
              : "Save & Publish Package"}
        </Button>
      </div>
    </Dialog>
  );
}

function InputBox({
  label,
  value,
  center,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  center?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-[#5F675F]">
        {label}
      </label>
      <input
        type="number"
        min={0}
        step={label === "PRICING" ? "0.01" : "1"}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none disabled:opacity-60 ${
          center ? "text-center" : ""
        }`}
      />
    </div>
  );
}
