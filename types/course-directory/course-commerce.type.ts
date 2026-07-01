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

export type CourseEnrollmentSortBy = "enrolledAt" | "amountPaid";

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
  revenueYtd: number;
  refunded: number;
  currency: string;
  totalStudentsBadge?: string | null;
  activeNowBadge?: string | null;
  revenueBadge?: string | null;
  refundedBadge?: string | null;
}

export interface CourseEnrollmentStudent {
  id: string;
  name: string;
  studentCode: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
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
