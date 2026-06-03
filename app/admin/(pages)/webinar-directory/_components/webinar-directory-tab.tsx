"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { WebinarDirectoryTab as WebinarDirectoryTabValue } from "@/types/webinar/webinar_type";

type WebinarTab = {
  key: string;
  value: WebinarDirectoryTabValue;
};

const WebinarTabs: WebinarTab[] = [
  {
    key: "Upcoming Scheduled",
    value: "upcoming-scheduled",
  },
  {
    key: "Live Now",
    value: "live-now",
  },
  {
    key: "Drafts",
    value: "draft",
  },
];

const WebinarDirectoryTab = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawTab = searchParams.get("tab");
  const activeTab =
    rawTab === "past-recordings"
      ? "draft"
      : ((rawTab as WebinarDirectoryTabValue) || "upcoming-scheduled");

  const handleChangeTab = (tab: WebinarDirectoryTabValue) => {
    router.push(`?tab=${tab}`);
  };

  return (
    <div className="inline-flex flex-wrap-reverse items-center gap-4 rounded-full bg-gray-100 px-3 py-3">
      {WebinarTabs.map((tab) => (
        <button
          className={`${tab.value === activeTab && "bg-[#004928] text-white"} rounded-full px-4 py-1 text-base transition-all duration-300`}
          key={tab.key}
          onClick={() => handleChangeTab(tab.value)}
        >
          {tab.key}
        </button>
      ))}
    </div>
  );
};

export default WebinarDirectoryTab;
