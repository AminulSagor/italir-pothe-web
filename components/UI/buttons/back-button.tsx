"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  iconClassName?: string;
}

export default function BackButton({
  className = "",
  iconClassName = "",
}: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      className={`flex size-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#F4F7F4] ${className}`}
    >
      <ArrowLeft className={`size-4 text-[#006B3F] ${iconClassName}`} />
    </button>
  );
}
