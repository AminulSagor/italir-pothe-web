import { BookOpen, Globe, Snowflake } from "lucide-react";
import { PackagePerformanceTableItem } from "./package-performance-table.type";

export const packagePerformanceTableItems: PackagePerformanceTableItem[] = [
  {
    id: 1,
    packageName: "Master Conversation Pack",
    type: "AI Bundle",
    sales: "1,248",
    revenue: "€56,784.00",
    icon: Globe,
    iconBg: "bg-[#E3F5EF]",
    iconColor: "text-[#006B3F]",
    badgeBg: "bg-[#DFF1EA]",
    badgeColor: "text-[#006B3F]",
  },
  {
    id: 2,
    packageName: "Monthly Shield",
    type: "Streak Freeze",
    sales: "856",
    revenue: "€4,271.44",
    icon: Snowflake,
    iconBg: "bg-[#E7F1FF]",
    iconColor: "text-[#1677FF]",
    badgeBg: "bg-[#DDEBFF]",
    badgeColor: "text-[#1677FF]",
  },
  {
    id: 3,
    packageName: "Vocabulary Booster",
    type: "AI Bundle",
    sales: "412",
    revenue: "€18,746.00",
    icon: BookOpen,
    iconBg: "bg-[#FFF1DD]",
    iconColor: "text-[#C46A00]",
    badgeBg: "bg-[#DFF1EA]",
    badgeColor: "text-[#006B3F]",
  },
];
