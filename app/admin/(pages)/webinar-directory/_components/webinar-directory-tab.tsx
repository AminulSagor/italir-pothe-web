"use client";

import { useRouter, useSearchParams } from "next/navigation";

type tabs = "upcoming-scheduled" | "live-now" | "past-recordings";

type WebinarTab = {
  key: string;
  value: tabs;
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
    key: "Past Recordings",
    value: "past-recordings",
  },
];

const WebinarDirectoryTab = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get("tab") as tabs) || "upcoming-scheduled";

  const handleChangeTab = (tab: tabs) => {
    router.push(`?tab=${tab}`);
  };

  return (
    <div className="items-center gap-4 bg-gray-100 py-3 inline-flex flex-wrap-reverse rounded-full px-3">
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
