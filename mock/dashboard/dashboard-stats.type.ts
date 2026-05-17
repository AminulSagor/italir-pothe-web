// types/dashboard/dashboard-stats.type.ts

import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  id: number;
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
}
