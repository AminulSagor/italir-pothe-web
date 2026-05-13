import { LucideIcon } from "lucide-react";

export interface PackagePerformanceStat {
  id: number;
  title: string;
  value: string;
  badge?: string;
  icon: LucideIcon;
  variant?: "primary" | "default";
}