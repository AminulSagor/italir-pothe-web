export type InfluencerPartnerStatus = "active" | "inactive" | "suspended";

export type InfluencerCouponStatus = "draft" | "active" | "paused" | "expired";

export type InfluencerPaymentMethod =
  | "bank_transfer"
  | "paypal"
  | "wise"
  | "manual";

export type InfluencerSocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "linkedin"
  | "website"
  | "other";

export type InfluencerCouponProductDomain = "course" | "store_package";

export type InfluencerBillingProvider = "google_play" | "app_store";

export type InfluencerCouponOwnerType = "influencer" | "product";

export type InfluencerPartnerSortBy =
  | "createdAt"
  | "fullName"
  | "usersLinked"
  | "totalSales"
  | "commission";

export type InfluencerSortOrder = "ASC" | "DESC";

export type InfluencerLedgerTransactionType =
  | "commission"
  | "payout"
  | "manual_adjustment"
  | "reversal";

export type InfluencerLedgerStatus = "pending" | "paid" | "cancelled";

export interface InfluencerDashboard {
  totalPartners: number;
  activePartners: number;
  totalLinkedUsers: number;
  activeReferrals: number;
  totalSales: string;
  lifetimeCommissionEarned: string;
  totalCommissionOwed: string;
  pendingPayoutAmount: string;
  paidPayoutAmount: string;
  currency: string;
}

export interface InfluencerPartnerListItem {
  id: string;
  fullName: string;
  email: string;
  title: string | null;
  avatarUrl: string | null;
  status: InfluencerPartnerStatus;
  paymentMethod: InfluencerPaymentMethod | null;
  paymentDisplayLabel: string | null;
  currency: string;

  primaryCouponCode: string | null;
  userDiscountPercentage: number;
  influencerSharePercentage: number;
  couponStatus: InfluencerCouponStatus | null;
  couponStartsAt: string | null;
  couponExpiresAt: string | null;

  usersLinked: number;
  totalSalesEur: string;
  commissionEarnedEur: string;
  commissionOwedEur: string;

  lastActivityAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InfluencerListMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface InfluencerPartnerListResponse {
  items: InfluencerPartnerListItem[];
  meta: InfluencerListMeta;
}

export interface InfluencerPartnerQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: InfluencerPartnerStatus;
  couponCode?: string;
  productDomain?: InfluencerCouponProductDomain;
  sortBy?: InfluencerPartnerSortBy;
  sortOrder?: InfluencerSortOrder;
}

export interface InfluencerSocialHandle {
  id?: string;
  platform: InfluencerSocialPlatform;
  handle: string;
  url?: string | null;
  sortOrder?: number;
}

export interface InfluencerProviderMapping {
  id?: string;
  productDomain: InfluencerCouponProductDomain;
  courseId?: string | null;
  storePackageId?: string | null;
  provider: InfluencerBillingProvider;
  regularProviderProductId: string;
  discountedProviderProductId: string;
  providerBasePlanId?: string | null;
  providerOfferId?: string | null;
  isActive?: boolean;
}

export interface InfluencerDeal {
  id?: string;
  couponCode: string;
  ownerType?: InfluencerCouponOwnerType;
  userDiscountPercentage: number;
  influencerSharePercentage: number;
  lifetimeAssociationEnabled?: boolean;
  status?: InfluencerCouponStatus;
  startsAt?: string | null;
  expiresAt?: string | null;
  notes?: string | null;
  providerMappings?: InfluencerProviderMapping[];
}

export interface InfluencerPartnerDetail extends InfluencerPartnerListItem {
  administrativeNotes: string | null;
  paymentDetails: Record<string, unknown> | null;
  socialHandles: InfluencerSocialHandle[];
  deals: InfluencerDeal[];
}

export interface InfluencerLedgerEntry {
  id: string;
  partnerId: string;
  couponId: string | null;
  attributionId: string | null;
  orderDomain: InfluencerCouponProductDomain | null;
  orderId: string | null;
  transactionType: InfluencerLedgerTransactionType;
  referenceId: string;
  amountEur: string;
  status: InfluencerLedgerStatus;
  notes: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface InfluencerPartnerDetailResponse {
  partner: InfluencerPartnerDetail;
  stats: {
    usersLinked: number;
    totalSalesEur: string;
    commissionEarnedEur: string;
    commissionOwedEur: string;
  };
  payoutHistory: InfluencerLedgerEntry[];
}

export interface InfluencerReport {
  partner: InfluencerPartnerDetail;
  summary: {
    totalUsers: number;
    totalConversions: number;
    totalSalesEur: string;
    lifetimeEarningsEur: string;
    commissionOwedEur: string;
  };
  earningsGrowthTrend: Array<{
    month: string;
    salesEur: string;
    commissionEur: string;
  }>;
  payoutHistory: InfluencerLedgerEntry[];
}

export interface InfluencerPartnerPayload {
  fullName: string;
  email: string;
  title?: string | null;
  avatarUrl?: string | null;
  status?: InfluencerPartnerStatus;
  paymentMethod?: InfluencerPaymentMethod;
  paymentDisplayLabel?: string | null;
  paymentDetails?: Record<string, unknown> | null;
  currency?: string;
  administrativeNotes?: string | null;
  socialHandles?: InfluencerSocialHandle[];
  deal?: InfluencerDeal;
}

export interface InfluencerManualPayoutPayload {
  transactionDate?: string;
  amountEur: string;
  transactionType?: InfluencerLedgerTransactionType;
  status?: InfluencerLedgerStatus;
  referenceId?: string;
  notes?: string | null;
}

export interface InfluencerArchiveResponse {
  id: string;
  status: InfluencerPartnerStatus;
}
