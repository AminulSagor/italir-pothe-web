"use client";

import { Lock, Unlock } from "lucide-react";

interface AccessControlConfirmDialogProps {
  open: boolean;
  nextIsFree: boolean;
  onCancel: () => void;
  onOk: () => void;
}

export default function AccessControlConfirmDialog({
  open,
  nextIsFree,
  onCancel,
  onOk,
}: AccessControlConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-xl">
        <div
          className={`mx-auto flex size-20 items-center justify-center rounded-3xl ${
            nextIsFree ? "bg-[#DDF3E8]" : "bg-[#FBE4E4]"
          }`}
        >
          {nextIsFree ? (
            <Unlock className="size-9 text-[#007A4A]" />
          ) : (
            <Lock className="size-9 text-[#D83324]" />
          )}
        </div>

        <h2 className="mt-7 text-2xl font-bold text-[#202420]">
          Change Access Control?
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#66736B]">
          Are you sure you want to change this lesson access to{" "}
          <span className="font-semibold text-[#202420]">
            {nextIsFree ? "Free" : "Premium"}
          </span>
          ?
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 rounded-full border border-[#CAD3CB] text-sm font-semibold text-[#202420]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onOk}
            className="h-12 rounded-full bg-[#006B3F] text-sm font-semibold text-white shadow-md"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
