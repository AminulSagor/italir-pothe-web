"use client";

import { Loader2, MessageSquare } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { CertificationCenterResponse } from "@/types/evaluation-center/evaluation-center.type";

interface IssueCertificateDialogProps {
  open: boolean;
  data: CertificationCenterResponse;
  notifyStudent: boolean;
  isSubmitting: boolean;

  onNotifyStudentChange: (value: boolean) => void;

  onClose: () => void;
  onConfirm: () => void;
}

export default function IssueCertificateDialog({
  open,
  data,
  notifyStudent,
  isSubmitting,
  onNotifyStudentChange,
  onClose,
  onConfirm,
}: IssueCertificateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} size="md">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 flex size-20 items-center justify-center rounded-full bg-[#E3F2FF]">
          <MessageSquare className="size-9 fill-[#006B3F] text-[#006B3F]" />
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">
          Issue Official Certificate?
        </h2>

        <p className="mt-7 max-w-[460px] text-base leading-7 text-[#4D5750]">
          Final review for &quot;
          {data.course.title}
          &quot;. Issuing will generate a verifiable digital certificate for{" "}
          {data.student.fullName}.
        </p>

        <label className="mt-8 flex w-full max-w-[420px] items-center justify-between rounded-full bg-[#F1F5EF] px-6 py-4">
          <span className="text-sm font-semibold text-[#202420]">
            Notify Student
          </span>

          <input
            type="checkbox"
            checked={notifyStudent}
            disabled={isSubmitting}
            onChange={(event) => onNotifyStudentChange(event.target.checked)}
            className="size-5 accent-[#006B3F]"
          />
        </label>

        <div className="mt-11 flex items-center justify-center gap-6">
          <Button
            size="lg"
            disabled={isSubmitting}
            className="h-11 min-w-[165px] bg-[#59F94D] !text-[#006B3F] hover:!bg-[#48E93E]"
            onClick={onConfirm}
          >
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Issue & Notify
          </Button>

          <Button
            size="lg"
            variant="ghost"
            disabled={isSubmitting}
            className="h-11 min-w-[165px] bg-[#DDE3DD] text-[#66736A] hover:bg-[#D3DAD3]"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
