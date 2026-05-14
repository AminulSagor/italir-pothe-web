import { IMAGE } from "@/constant/image.path";
import {
  AiBundlePackage,
  PackageStat,
  StreakFreezePackage,
  TransactionLog,
} from "./package-store.types";

export const packageStoreStats: PackageStat[] = [
  {
    id: 1,
    title: "TOTAL REVENUE",
    value: "€2,482.50",
    subtitle: "↗ +12.5% from last month",
    icon: "💵",
    iconBg: "bg-[#DDF3E8]",
  },
  {
    id: 2,
    title: "TOTAL ORDERS",
    value: "1,248",
    subtitle: "↗ +8% from last month",
    icon: "🛍️",
    iconBg: "bg-[#DDEFF6]",
  },
  {
    id: 3,
    title: "TOP PACKAGE",
    value: "Fluent Learner",
    subtitle: "42% of total sales",
    icon: "✦",
    iconBg: "bg-[#F0DDF0]",
  },
];

export const aiBundlePackages: AiBundlePackage[] = [
  {
    id: 1,
    packageName: "Fluent Learner",
    voiceMins: "60 Mins",
    textTokens: "5,000",
    price: "€6.99",
    badge: "MOST POPULAR",
  },
  {
    id: 2,
    packageName: "Basic Starter",
    voiceMins: "15 Mins",
    textTokens: "1,000",
    price: "€2.49",
  },
];

export const streakFreezePackages: StreakFreezePackage[] = [
  {
    id: 1,
    packageName: "Weekend Savior",
    description: "3 Streak Freezes",
    freezeCount: 3,
    price: "€1.99",
  },
  {
    id: 2,
    packageName: "Monthly Shield",
    description: "10 Streak Freezes",
    freezeCount: 10,
    price: "€4.99",
    badge: "BEST VALUE!",
  },
];

export const transactionLogs: TransactionLog[] = [
  {
    id: 1,
    orderId: "#ORD-7742",
    customerName: "Alex Rivera",
    customerAvatar: IMAGE.customer,
    packageName: "Fluent Learner (AI)",
    date: "Oct 12, 2023",
    amount: "€6.99",
    status: "Completed",
  },
  {
    id: 2,
    orderId: "#ORD-7741",
    customerName: "Sofia Chen",
    customerAvatar: IMAGE.customer,
    packageName: "Weekend Savior (Freeze)",
    date: "Oct 11, 2023",
    amount: "€3.50",
    status: "Pending",
  },
  {
    id: 3,
    orderId: "#ORD-7740",
    customerName: "Marcus Thorne",
    customerAvatar: IMAGE.customer,
    packageName: "Polyglot Pro (AI)",
    date: "Oct 11, 2023",
    amount: "€12.99",
    status: "Refunded",
  },
];
