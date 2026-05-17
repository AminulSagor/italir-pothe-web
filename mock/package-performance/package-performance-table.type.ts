import { LucideIcon } from "lucide-react";

export interface PackagePerformanceTableItem {
  id: number;
  packageName: string;
  type: string;
  sales: string;
  revenue: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
}
