import { Suspense } from "react";

import WebinarFormClient from "./_components/webinar-form-client";

const Page = () => {
  return (
    <Suspense fallback={null}>
      <WebinarFormClient />
    </Suspense>
  );
};

export default Page;
