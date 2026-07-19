import { Suspense } from "react";

import ResolveReportClient from "./_components/resolve-report-client";

export default function ResolveReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-black/45">
          Loading moderation report...
        </div>
      }
    >
      <ResolveReportClient />
    </Suspense>
  );
}
