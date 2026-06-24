"use client";

import { useEffect } from "react";

import AppStatusPage from "@/components/system/app-status-page";

interface AppErrorProps {
  error: Error & {
    digest?: string;
  };

  reset?: () => void;
  unstable_retry?: () => void;
}

export default function AppError({
  error,
  reset,
  unstable_retry,
}: AppErrorProps) {
  useEffect(() => {
    console.error("Application route error:", error);
  }, [error]);

  const handleRetry = () => {
    if (unstable_retry) {
      unstable_retry();
      return;
    }

    if (reset) {
      reset();
      return;
    }

    window.location.reload();
  };

  return (
    <AppStatusPage
      variant="server-error"
      reference={error.digest}
      primaryAction={{
        label: "Try Again",
      }}
      secondaryAction={{
        label: "Go to Dashboard",
        href: "/admin/dashboard",
      }}
      onPrimaryAction={handleRetry}
    />
  );
}
