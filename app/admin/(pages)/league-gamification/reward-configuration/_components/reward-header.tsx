"use client";

import { ArrowLeft, Gift, Loader2 } from "lucide-react";

interface RewardHeaderProps {
  isSubmitting: boolean;
  onBack: () => void;
  onConfirm: () => void;
}

export default function RewardHeader({
  isSubmitting,
  onBack,
  onConfirm,
}: RewardHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft className="size-4" />
          Back to Rewards
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-black/90">
          Reward Configuration
        </h1>

        <p className="mt-2 text-base text-black/60">
          Set up and dispatch rewards for top-performing students.
        </p>
      </div>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={onConfirm}
        className="flex h-14 items-center justify-center gap-3 rounded-full bg-secondary px-10 text-lg font-semibold text-white shadow-lg shadow-green-900/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Gift className="size-5" />
        )}

        {isSubmitting ? "Creating Reward..." : "Confirm Gift"}
      </button>
    </div>
  );
}
