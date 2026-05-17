import { LucideIcon } from "lucide-react";

export interface RevenueStat {
  id: number;
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
  highlighted?: boolean;
}

export interface RevenueChartData {
  day: string;
  revenue: number;
}

export interface TransactionItem {
  id: number;
  orderId: string;
  userName: string;
  userInitial: string;
  item: string;
  amount: string;
  date: string;
  status: "Completed";
}
