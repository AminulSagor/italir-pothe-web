"use client";

import { Loader2, Send, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";

export interface RetakeFormState {
  keyStrength: string;
  criticalGap: string;

  teacherComment: string;
  teacherCommentBn: string;

  notifyStudent: boolean;
}

interface RequestRetakeDialogProps {
  open: boolean;
  form: RetakeFormState;
  isSubmitting: boolean;

  onChange: (form: RetakeFormState) => void;

  onClose: () => void;
  onConfirm: () => void;
}

export default function RequestRetakeDialog({
  open,
  form,
  isSubmitting,
  onChange,
  onClose,
  onConfirm,
}: RequestRetakeDialogProps) {
  const updateField = <Key extends keyof RetakeFormState>(
    key: Key,
    value: RetakeFormState[Key],
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
          aria-label="Close retake dialog"
        >
          <X className="size-4" />
        </button>

        <h2 className="text-xl font-bold text-[#006B3F]">
          Request Final Exam Retake
        </h2>
      </div>

      <div className="grid gap-5 px-7 py-6 sm:grid-cols-2">
        <TextAreaField
          label="Key Strength"
          value={form.keyStrength}
          disabled={isSubmitting}
          onChange={(value) => updateField("keyStrength", value)}
        />

        <TextAreaField
          label="Critical Gap"
          required
          value={form.criticalGap}
          disabled={isSubmitting}
          onChange={(value) => updateField("criticalGap", value)}
        />

        <TextAreaField
          label="Teacher Comment"
          required
          value={form.teacherComment}
          disabled={isSubmitting}
          onChange={(value) => updateField("teacherComment", value)}
        />

        <TextAreaField
          label="Teacher Comment (Bangla)"
          value={form.teacherCommentBn}
          disabled={isSubmitting}
          onChange={(value) => updateField("teacherCommentBn", value)}
        />

        <label className="flex items-center justify-between rounded-full bg-[#F1F5EF] px-5 py-4 sm:col-span-2">
          <span className="text-sm font-semibold text-[#202420]">
            Notify Student
          </span>

          <input
            type="checkbox"
            checked={form.notifyStudent}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField("notifyStudent", event.target.checked)
            }
            className="size-5 accent-[#006B3F]"
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 bg-[#F7FAF5] px-7 py-6 sm:flex-row sm:justify-between">
        <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
          Close
        </Button>

        <Button disabled={isSubmitting} onClick={onConfirm}>
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Send className="mr-2 size-4" />
          )}
          Confirm Retake
        </Button>
      </div>
    </Dialog>
  );
}

function TextAreaField({
  label,
  value,
  required = false,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  required?: boolean;
  disabled: boolean;

  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
        {label}

        {required && <span className="ml-1 text-[#D92D20]">*</span>}
      </span>

      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full resize-none rounded-[1.5rem] bg-[#EEF3EC] p-4 text-sm outline-none"
      />
    </label>
  );
}
