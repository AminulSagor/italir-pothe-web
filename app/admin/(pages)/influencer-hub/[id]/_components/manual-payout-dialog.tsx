"use client";

import { Loader2, X } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import type {
  InfluencerLedgerStatus,
  InfluencerLedgerTransactionType,
  InfluencerManualPayoutPayload,
} from "@/types/influencer-hub/influencer-hub.type";

interface ManualPayoutDialogProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: InfluencerManualPayoutPayload) => void;
}

interface ManualPayoutForm {
  transactionDate: string;
  amountEur: string;
  transactionType: InfluencerLedgerTransactionType;
  status: InfluencerLedgerStatus;
  referenceId: string;
  notes: string;
}

const createInitialForm = (): ManualPayoutForm => ({
  transactionDate: new Date().toISOString().slice(0, 10),
  amountEur: "",
  transactionType: "payout",
  status: "paid",
  referenceId: "",
  notes: "",
});

const getSnapshot = (form: ManualPayoutForm) => JSON.stringify(form);

export default function ManualPayoutDialog({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: ManualPayoutDialogProps) {
  const [form, setForm] = useState<ManualPayoutForm>(createInitialForm);

  const initialSnapshot = useMemo(() => getSnapshot(createInitialForm()), []);

  const currentSnapshot = useMemo(() => getSnapshot(form), [form]);

  const isDirty = open && currentSnapshot !== initialSnapshot;

  const unsaved = useUnsavedChangesWarning(isDirty);

  const updateForm = <Key extends keyof ManualPayoutForm>(
    key: Key,
    value: ManualPayoutForm[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetAndClose = () => {
    setForm(createInitialForm());
    onClose();
  };

  const requestClose = () => {
    unsaved.requestAction(resetAndClose);
  };

  const handleSubmit = () => {
    onSubmit({
      transactionDate: form.transactionDate
        ? new Date(form.transactionDate).toISOString()
        : undefined,
      amountEur: form.amountEur,
      transactionType: form.transactionType,
      status: form.status,
      referenceId: form.referenceId.trim() || undefined,
      notes: form.notes.trim() || null,
    });
  };

  return (
    <>
      <Dialog open={open} onClose={requestClose} size="lg" className="p-0">
        <div className="border-b border-black/10 px-7 py-6">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={requestClose}
            className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-black/55 disabled:opacity-50"
            aria-label="Close manual payout modal"
          >
            <X className="size-4" />
          </button>

          <h2 className="text-xl font-bold text-deep-green">
            Add Manual Payout Entry
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/50">
            Add payout, manual adjustment, commission or reversal entry for this
            influencer ledger.
          </p>
        </div>

        <div className="space-y-5 px-7 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Transaction Date"
              type="date"
              value={form.transactionDate}
              onChange={(value) => updateForm("transactionDate", value)}
            />

            <InputField
              label="Amount EUR"
              type="number"
              value={form.amountEur}
              placeholder="200.00"
              onChange={(value) => updateForm("amountEur", value)}
            />

            <SelectField
              label="Transaction Type"
              value={form.transactionType}
              onChange={(value) =>
                updateForm(
                  "transactionType",
                  value as InfluencerLedgerTransactionType,
                )
              }
              options={[
                ["commission", "Commission"],
                ["payout", "Payout"],
                ["manual_adjustment", "Manual Adjustment"],
                ["reversal", "Reversal"],
              ]}
            />

            <SelectField
              label="Status"
              value={form.status}
              onChange={(value) =>
                updateForm("status", value as InfluencerLedgerStatus)
              }
              options={[
                ["pending", "Pending"],
                ["paid", "Paid"],
                ["cancelled", "Cancelled"],
              ]}
            />

            <InputField
              label="Reference ID"
              value={form.referenceId}
              placeholder="TR-NEW"
              onChange={(value) => updateForm("referenceId", value)}
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-black/40">
              Notes
            </span>

            <textarea
              value={form.notes}
              placeholder="Manual payout adjustment."
              onChange={(event) => updateForm("notes", event.target.value)}
              className="min-h-28 w-full resize-none rounded-[1.5rem] bg-[#EEF3EC] px-5 py-4 text-sm outline-none placeholder:text-black/30"
            />
          </label>

          <div className="rounded-2xl border border-[#FFE2A8] bg-[#FFF8E8] p-4 text-xs leading-5 text-[#7A4E00]">
            Default values follow Figma requirement: transaction type is payout
            and status is paid. This modal only records backend ledger entries;
            it does not send money automatically.
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={requestClose}
          >
            Cancel
          </Button>

          <Button
            disabled={isSubmitting || !form.amountEur.trim()}
            onClick={handleSubmit}
            className="gap-2 bg-secondary text-white"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Add Manual Entry
          </Button>
        </div>
      </Dialog>

      <UnsavedChangesWarningDialog
        open={unsaved.warningOpen}
        onCancel={unsaved.cancelNavigation}
        onConfirm={unsaved.confirmNavigation}
      />
    </>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none placeholder:text-black/30"
      />
    </label>
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
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-black/40">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
