export type CoursePurchaseEnvironment =
  | "development"
  | "sandbox"
  | "production";

export type CoursePurchaseVerificationStatus =
  | "pending"
  | "verified"
  | "failed";

export type CommerceSortOrder = "ASC" | "DESC";

export type CoursePaymentProvider = "google_play" | "app_store";

export type CourseProviderProductType = "non_consumable";

export interface CourseProviderProduct {
  id: string;
  provider: CoursePaymentProvider;
  productId: string;
  productType: CourseProviderProductType;
  basePlanId: string | null;
  offerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProviderProductListResponse {
  items: CourseProviderProduct[];
}

export interface CreateCourseProviderProductPayload {
  provider: CoursePaymentProvider;
  productId: string;
  productType?: CourseProviderProductType;
  basePlanId?: string | null;
  offerId?: string | null;
  isActive?: boolean;
}

export interface UpdateCourseProviderProductPayload {
  productId?: string;
  productType?: CourseProviderProductType;
  basePlanId?: string | null;
  offerId?: string | null;
  isActive?: boolean;
}

export interface CourseProviderProductMutationResponse {
  message: string;
  providerProduct: CourseProviderProduct;
}

export interface DeleteCourseProviderProductResponse {
  message: string;
  providerProductId: string;
}

export type CourseEnrollmentSortBy = "enrolledAt" | "amountPaid";

export interface CourseEnrollmentBilling {
  provider: string | null;
  productId: string | null;
  productType: string | null;
  basePlanId: string | null;
  offerId: string | null;
  environment: string | null;
  verificationStatus: string | null;
  providerTransactionId: string | null;
  tokenHash: string | null;
  verifiedAt: string | null;
}

export interface CoursePurchaseStoreProductSnapshot {
  provider: CoursePaymentProvider | string | null;
  productId: string | null;
  productType:
    | CourseProviderProductType
    | "consumable"
    | "subscription"
    | string
    | null;
  basePlanId?: string | null;
  offerId?: string | null;
}

export interface CoursePurchaseVerificationSnapshot {
  environment: CoursePurchaseEnvironment | string | null;
  status?: CoursePurchaseVerificationStatus | string | null;
  verificationStatus?: CoursePurchaseVerificationStatus | string | null;
  providerTransactionId: string | null;
  purchaseTokenHash?: string | null;
  tokenHash?: string | null;
  verifiedAt: string | null;
}

export interface CoursePurchasePaymentSnapshot {
  provider: CoursePaymentProvider | string | null;
  providerReference?: string | null;
  failureCode?: string | null;
  failureMessage?: string | null;
  paidAt?: string | null;
  refundedAt?: string | null;
  refundReason?: string | null;
}

export interface CoursePurchaseRefundOperation {
  id?: string;
  status: string | null;
  source: string | null;
  revoke?: boolean | null;
  reason: string | null;
  failureCode: string | null;
  failureMessage: string | null;
  providerCompletedAt: string | null;
  completedAt: string | null;
}

export interface CoursePurchaseSubscriptionSnapshot {
  status: string | null;
  entitlementActive: boolean | null;
  autoRenewEnabled: boolean | null;
  startedAt: string | null;
  expiresAt: string | null;
  canceledAt: string | null;
  revokedAt: string | null;
  lastSyncedAt: string | null;
  environment: CoursePurchaseEnvironment | string | null;
}

export interface CourseEnrollmentQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentProvider?: CoursePaymentProvider | string;
  sortBy?: CourseEnrollmentSortBy;
  sortOrder?: CommerceSortOrder;
}

export interface CourseEnrollmentSummary {
  courseId: string;
  totalStudents: number;
  activeNow: number;
  revenueYtd: {
    currency: string;
    amount: string;
  };
  refundedLast30Days: number;
  activeWindowMinutes: number;
}

export interface CourseEnrollmentStudent {
  id: string;
  name: string;
  studentCode: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
}

export interface CourseEnrollmentOrder {
  id: string;
  orderNumber: string | null;
  amountPaid: number;
  currency: string;
  amountPaidEur: string | null;
  paymentProvider: string | null;
  status: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  billing: CourseEnrollmentBilling | null;

  providerSnapshot?: CoursePurchaseStoreProductSnapshot | null;
  providerTransaction?: CoursePurchaseVerificationSnapshot | null;
  refundOperation?: CoursePurchaseRefundOperation | null;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  orderId: string | null;
  userId: string | null;
  student: CourseEnrollmentStudent;
  amountPaid: number;
  currency: string;
  status: string;
  paymentProvider: string;
  billing: CourseEnrollmentBilling | null;
  order: CourseEnrollmentOrder | null;

  storeProduct?: CoursePurchaseStoreProductSnapshot | null;
  verification?: CoursePurchaseVerificationSnapshot | null;
  payment?: CoursePurchasePaymentSnapshot | null;
  subscription?: CoursePurchaseSubscriptionSnapshot | null;

  enrolledAt: string | null;
  refundedAt: string | null;
}

export interface CourseEnrollmentDetails extends CourseEnrollment {
  courseTitle: string | null;
  paymentReference: string | null;
  paymentStatus: string | null;
}

export interface CourseEnrollmentListResponse {
  items: CourseEnrollment[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CourseEnrollmentFilterOptions {
  statuses: string[];
  paymentProviders: string[];
}
