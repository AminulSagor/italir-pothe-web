export type StorePackageType = "ai_bundle" | "streak_freeze" | "cv_credit";

export type StorePackageStatus = "published" | "archived";

export type StoreMarketingBadge =
  | "none"
  | "limited_time"
  | "most_popular"
  | "best_value";

export type StoreBillingModel = "one_time" | "monthly";

export type StreakProtectionMode = "finite" | "monthly_unlimited";

export type StorePaymentProvider = "google_play" | "stripe";

export type StoreOrderStatus = "pending" | "completed" | "failed" | "refunded";

export type StoreSortOrder = "ASC" | "DESC";

export type StoreOrderSortBy = "createdAt" | "totalAmountEur" | "orderNumber";

export interface StorePackage {
  id: string;
  type: StorePackageType;
  name: string;
  description: string | null;
  priceEur: string;
  billingModel: StoreBillingModel;
  marketingBadge: StoreMarketingBadge | null;
  aiVoiceMinutes: number;
  aiTextTokens: number;
  cvCredits: number;
  streakFreezeCount: number;
  streakProtectionMode: StreakProtectionMode | null;
  protectionDurationDays: number | null;
  couponEnabled: boolean;
  couponCode: string | null;
  sortOrder: number;
  status: StorePackageStatus;
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  googlePlayProductId: string | null;
  stripePriceId: string | null;
}

export interface StorePackageListResponse {
  items: StorePackage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StorePackageQuery {
  packageType?: StorePackageType;
  status?: StorePackageStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateStorePackagePayload {
  packageType: StorePackageType;
  name: string;
  description?: string;
  priceEur: string;
  billingModel?: StoreBillingModel;
  voiceMinutes?: number;
  textTokens?: number;
  freezeCount?: number;
  streakProtectionMode?: StreakProtectionMode;
  protectionDurationDays?: number;
  cvCreditCount?: number;
  marketingBadge?: StoreMarketingBadge;
  couponsEnabled?: boolean;
  couponCode?: string;
  googlePlayProductId?: string;
  stripePriceId?: string;
  sortOrder?: number;
}

export interface UpdateStorePackagePayload {
  name?: string;
  description?: string | null;
  priceEur?: string;
  billingModel?: StoreBillingModel;
  voiceMinutes?: number;
  textTokens?: number;
  freezeCount?: number;
  streakProtectionMode?: StreakProtectionMode | null;
  protectionDurationDays?: number | null;
  cvCreditCount?: number;
  marketingBadge?: StoreMarketingBadge;
  couponsEnabled?: boolean;
  couponCode?: string | null;
  googlePlayProductId?: string | null;
  stripePriceId?: string | null;
  sortOrder?: number;
}

export interface ReorderStorePackagesPayload {
  items: Array<{
    packageId: string;
    sortOrder: number;
  }>;
}

export interface CvEconomyConfiguration {
  id?: string;
  configKey?: string;
  freeCreditsPerSignup: number;
  allowEditingWithoutCredit: boolean;
  updatedByAdminId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateCvEconomyConfigurationPayload {
  freeCreditsPerSignup: number;
  allowEditingWithoutCredit: boolean;
}

export interface PackageStoreDashboard {
  totalRevenueEur: string;
  totalOrders: number;
  topPackage: {
    id: string;
    name: string;
    orderCount: number;
    salesPercentage: number;
  } | null;
  changes: {
    revenuePercentage: number;
    orderPercentage: number;
  };
  packageCounts: {
    total: number;
    published: number;
    archived: number;
  };
}

export interface AdminStoreOrderQuery {
  page?: number;
  limit?: number;
  search?: string;
  packageType?: StorePackageType;
  status?: StoreOrderStatus;
  paymentProvider?: StorePaymentProvider;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: StoreOrderSortBy;
  sortOrder?: StoreSortOrder;
}

export interface StoreOrderUser {
  id: string;
  name: string | null;
  email: string | null;
  studentId: string | null;
}

export interface StoreOrderPackage {
  id: string;
  type: StorePackageType;
  name: string;
  description: string | null;
  billingModel: StoreBillingModel;
  marketingBadge: StoreMarketingBadge | null;
  entitlements: {
    voiceMinutes: number;
    textTokens: number;
    streakFreezes: number;
    cvCredits: number;
    streakProtectionMode: StreakProtectionMode | null;
    protectionDurationDays: number | null;
  };
}

export interface StoreOrderPricing {
  currency: string;
  packagePriceEur: string;
  couponCode: string | null;
  discountPercentage: number;
  discountAmountEur: string;
  totalAmountEur: string;
  paymentAmount: string;
  formattedPaymentAmount: string;
  forexRate: string | null;
}

export interface StoreOrderPayment {
  provider: StorePaymentProvider;
  providerReference: string | null;
  failureCode: string | null;
  failureMessage: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  refundReason: string | null;
}

export interface StoreOrderTimelineItem {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  occurredAt: string;
}

export interface StoreAdminOrder {
  id: string;
  orderNumber: string;
  status: StoreOrderStatus;
  user: StoreOrderUser | null;
  package: StoreOrderPackage;
  pricing: StoreOrderPricing;
  payment: StoreOrderPayment;
  reversal: {
    voiceMinutes: number;
    textTokens: number;
    freezeCount: number;
    cvCredits: number;
    unlimitedProtectionGrantedUntil: string | null;
  };
  timeline: StoreOrderTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreAdminOrderListResponse {
  items: StoreAdminOrder[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RefundStoreOrderPayload {
  reason?: string;
}

export interface PackageStoreMessageResponse {
  message: string;
  packageId?: string;
}
