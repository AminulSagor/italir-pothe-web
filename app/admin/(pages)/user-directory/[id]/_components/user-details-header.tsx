"use client";

import { ArrowLeft } from "lucide-react";

interface UserDetailsHeaderProps {
  onBack: () => void;
}

export default function UserDetailsHeader({ onBack }: UserDetailsHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex size-12 items-center justify-center rounded-full bg-[#EEF3EC] text-black/60"
          aria-label="Back to user directory"
        >
          <ArrowLeft className="size-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-secondary">User Details</h1>

          <p className="mt-1 text-base text-black/45">Get to know your user</p>
        </div>
      </div>
    </div>
  );
}
