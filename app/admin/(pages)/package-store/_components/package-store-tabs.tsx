import Link from "next/link";

import { PackageStoreTab } from "@/mock/package-store/package-store.types";

interface Props {
  activeTab?: string;
}

const tabs: {
  label: string;
  value: PackageStoreTab;
}[] = [
  { label: "AI Bundles", value: "ai-bundles" },
  { label: "Streak Freezes", value: "streak-freezes" },
  { label: "Order History", value: "order-history" },
];

export default function PackageStoreTabs({ activeTab }: Props) {
  const currentTab = activeTab || "ai-bundles";

  return (
    <div className="inline-flex rounded-full bg-[#EEF3EC] p-1">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.value;

        return (
          <Link
            key={tab.value}
            href={`/admin/package-store?tab=${tab.value}`}
            className={`rounded-full px-7 py-3 text-sm font-semibold transition ${
              isActive ? "bg-[#006B3F] text-white shadow-sm" : "text-[#4F5B52]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
