import { Suspense } from "react";

import CertificationCenterClient from "./_components/certification-center-client";

export default function CertificationCenterPage() {
  return (
    <Suspense fallback={null}>
      <CertificationCenterClient />
    </Suspense>
  );
}
