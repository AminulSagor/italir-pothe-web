import { Suspense } from "react";

import WebinarDirectoryTab from "@/app/admin/(pages)/webinar-directory/_components/webinar-directory-tab";
import WebinarHead from "@/app/admin/(pages)/webinar-directory/_components/webinar-head";
import WebinarList from "@/app/admin/(pages)/webinar-directory/_components/webinar-list";

const Page = () => {
  return (
    <div className="space-y-6">
      <WebinarHead />

      <Suspense fallback={null}>
        <WebinarDirectoryTab />
        <WebinarList />
      </Suspense>
    </div>
  );
};

export default Page;