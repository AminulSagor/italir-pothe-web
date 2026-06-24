"use client";

import { useEffect } from "react";

import AppStatusPage from "@/components/system/app-status-page";

import "./globals.css";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };

  reset?: () => void;
  unstable_retry?: () => void;
}

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global application error:", error);
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
    <html lang="en">
      <head>
        <title>Server Error | Italir Pothe</title>

        <meta
          name="description"
          content="An unexpected application error occurred."
        />
      </head>

      <body className="m-0 bg-[#F3F7F2] antialiased">
        <AppStatusPage
          variant="server-error"
          reference={error.digest}
          primaryAction={{
            label: "Reload Application",
          }}
          secondaryAction={{
            label: "Return Home",
            href: "/",
          }}
          onPrimaryAction={handleRetry}
        />
      </body>
    </html>
  );
}
