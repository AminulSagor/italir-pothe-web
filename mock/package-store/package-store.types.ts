export type PackageStoreTab = "ai-bundles" | "streak-freezes" | "order-history";

export interface PackageStat {
  id: number;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  iconBg: string;
}

export interface AiBundlePackage {
  id: number;
  packageName: string;
  voiceMins: string;
  textTokens: string;
  price: string;
  badge?: string;
}

export interface StreakFreezePackage {
  id: number;
  packageName: string;
  description: string;
  freezeCount: number;
  price: string;
  badge?: string;
}

export interface TransactionLog {
  id: number;
  orderId: string;
  customerName: string;
  customerAvatar: string;
  packageName: string;
  date: string;
  amount: string;
  status: "Completed" | "Pending" | "Refunded";
}
