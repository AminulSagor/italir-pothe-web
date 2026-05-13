import { Radio, RotateCcw, UsersRound, WalletCards } from "lucide-react";
import { CourseDetailsStat } from "./course-details-stats.type";

export const courseDetailsStats: CourseDetailsStat[] = [
  {
    id: 1,
    title: "Total Students",
    value: "1,248",
    badge: "↗ 12% This Month",
    icon: UsersRound,
    variant: "primary",
  },
  {
    id: 2,
    title: "Active Now",
    value: "892",
    badge: "⚡ Live Engagement",
    icon: Radio,
  },
  {
    id: 3,
    title: "Revenue (YTD)",
    value: "€62.4k",
    badge: "↗ Stable Growth",
    icon: WalletCards,
  },
  {
    id: 4,
    title: "Refunded",
    value: "12",
    badge: "Last 30 Days",
    icon: RotateCcw,
  },
];
