import { BookOpen, CalendarDays, GraduationCap, Sparkles } from "lucide-react";

import {
  RevenueChartData,
  RevenueStat,
  TransactionItem,
} from "./revenue-analytics.types";

export const revenueStats: RevenueStat[] = [
  {
    id: 1,
    title: "Total Lifetime Revenue",
    value: "€45,280.00",
    growth: "+12%",
    icon: BookOpen,
    highlighted: true,
  },
  {
    id: 2,
    title: "Revenue This Month",
    value: "€12,450.00",
    growth: "+8.2%",
    icon: CalendarDays,
  },
  {
    id: 3,
    title: "Course Revenue",
    value: "€38,120.00",
    growth: "+6.4%",
    icon: GraduationCap,
  },
  {
    id: 4,
    title: "All Packages Revenue",
    value: "€7,160.00",
    growth: "+4.1%",
    icon: Sparkles,
  },
];

export const revenueChartData: RevenueChartData[] = [
  {
    day: "Mon",
    revenue: 1200,
  },
  {
    day: "Tue",
    revenue: 1000,
  },
  {
    day: "Wed",
    revenue: 1800,
  },
  {
    day: "Thu",
    revenue: 1900,
  },
  {
    day: "Fri",
    revenue: 3400,
  },
  {
    day: "Sat",
    revenue: 3200,
  },
  {
    day: "Sun",
    revenue: 4100,
  },
];

export const recentTransactions: TransactionItem[] = [
  {
    id: 1,
    orderId: "#ISH-92841",
    userName: "Marco Silvestri",
    userInitial: "MS",
    item: "Complete B2 Course",
    amount: "€120.00",
    date: "Oct 24, 2023",
    status: "Completed",
  },
  {
    id: 2,
    orderId: "#ISH-92842",
    userName: "Elena Bianchi",
    userInitial: "EB",
    item: "AI Language Bundle",
    amount: "€45.50",
    date: "Oct 24, 2023",
    status: "Completed",
  },
  {
    id: 3,
    orderId: "#ISH-92845",
    userName: "Giuseppe Rossi",
    userInitial: "GR",
    item: "A1 Beginner Masterclass",
    amount: "€89.00",
    date: "Oct 23, 2023",
    status: "Completed",
  },
];
