"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "User Reports",
    href: "/admin/reports-moderation",
    exact: true,
  },
  {
    label: "AI Reports",
    href: "/admin/reports-moderation/ai-reports",
    exact: false,
  },
];

export default function ModerationTabs() {
  const pathname = usePathname();

  return (
    <div className="flex w-fit gap-2 rounded-full bg-white p-1 shadow-sm">
      {tabs.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              active
                ? "bg-secondary text-white"
                : "text-black/60 hover:bg-black/5"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
