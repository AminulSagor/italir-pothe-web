export type StorePackageType = "ai_bundle" | "streak_freeze" | "cv_credit";

export type StorePackageStatus = "published" | "archived";

export type StoreMarketingBadge =
  | "none"
  | "limited_time"
  | "most_popular"
  | "best_value";

export type StoreBillingModel = "one_time" | "monthly";

export type StreakProtectionMode = "finite" | "monthly_unlimited";

export type StorePaymentProvider = "google_play" | "app_store";

export type StoreProviderProductType =
  | "consumable"
  | "non_consumable"
  | "subscription";

export type StoreProviderEnvironment = "development" | "sandbox" | "production";

export type StoreProviderVerificationStatus = "pending" | "verified" | "failed";

export type StoreOrderStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled"
  | "expired"
  | "refunded";

export type StoreTimelineEventType =
  | "order_placed"
  | "order_cancelled"
  | "order_expired"
  | "payment_processed"
  | "payment_failed"
  | "entitlement_granted"
  | "refund_processed";

export type StoreSortOrder = "ASC" | "DESC";

export type StoreOrderSortBy = "createdAt" | "totalAmountEur" | "orderNumber";

export interface StoreProviderProduct {
  id: string;
  provider: StorePaymentProvider;
  productId: string;
  productType: StoreProviderProductType;
  basePlanId: string | null;
  offerId: string | null;
  isActive: boolean;
}

export interface StoreProviderProductListResponse {
  items: StoreProviderProduct[];
}

export interface CreateStoreProviderProductPayload {
  provider: StorePaymentProvider;
  productId: string;
  productType: StoreProviderProductType;
  basePlanId?: string;
  offerId?: string;
  isActive?: boolean;
}

export interface UpdateStoreProviderProductPayload {
  productId?: string;
  productType?: StoreProviderProductType;
  basePlanId?: string | null;
  offerId?: string | null;
  isActive?: boolean;
}

export interface StoreProviderProductMutationResponse {
  message: string;
  providerProduct: StoreProviderProduct;
}

export interface DeleteStoreProviderProductResponse {
  message: string;
  providerProductId: string;
}

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
  storeProduct: StoreProviderProduct | null;
  providerProducts?: StoreProviderProduct[];
  status: StorePackageStatus;
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
  provider?: StorePaymentProvider;
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

export interface StoreOrderProductSnapshot {
  providerProductId: string;
  provider: StorePaymentProvider;
  productId: string;
  productType: StoreProviderProductType;
  basePlanId: string | null;
  offerId: string | null;
}

export interface StoreOrderVerification {
  environment: StoreProviderEnvironment;
  status: StoreProviderVerificationStatus;
  providerTransactionId: string | null;
  purchaseTokenHash?: string | null;
  tokenHash?: string | null;
  verifiedAt: string | null;
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
  eventType: StoreTimelineEventType | string;
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
  storeProduct: StoreOrderProductSnapshot;
  verification: StoreOrderVerification;
  pricing: StoreOrderPricing;
  payment: StoreOrderPayment;

  reversal: {
    voiceMinutes: number;
    textTokens: number;
    freezeCount: number;
    cvCredits: number;
    unlimitedProtectionGrantedUntil: string | null;
  };

  subscription?: {
    status: string | null;
    entitlementActive: boolean | null;
    autoRenewEnabled: boolean | null;
    startedAt: string | null;
    expiresAt: string | null;
    canceledAt: string | null;
    revokedAt: string | null;
    lastSyncedAt: string | null;
    environment: StoreProviderEnvironment | null;
  } | null;

  timeline: StoreOrderTimelineItem[];

  checkoutExpiresAt: string | null;
  cancelledAt: string | null;
  expiredAt: string | null;

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

export interface ProviderRefundOperation {
  id: string;
  provider: StorePaymentProvider;
  scope: string;
  subjectType: string;
  subjectId: string;
  providerOrderId: string | null;
  status: string;
  reason: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefundStoreOrderPayload {
  reason?: string;
}

export interface PackageStoreMessageResponse {
  message: string;
  packageId?: string;
}
