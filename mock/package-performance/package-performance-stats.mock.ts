import { Award, Snowflake, Sparkles, WalletCards } from "lucide-react";
import { PackagePerformanceStat } from "./package-performance-stats.type";

export const packagePerformanceStats: PackagePerformanceStat[] = [
  {
    id: 1,
    title: "Total Package Revenue",
    value: "€45,280.00",
    badge: "+12%",
    icon: WalletCards,
    variant: "primary",
  },
  {
    id: 2,
    title: "Revenue This Month",
    value: "€12,450.00",
    icon: Snowflake,
  },
  {
    id: 3,
    title: "Course Revenue",
    value: "€38,120.00",
    icon: Sparkles,
  },
  {
    id: 4,
    title: "Best Seller",
    value: "AI Master Pack",
    badge: "TOP PERFORMER",
    icon: Award,
  },
];
