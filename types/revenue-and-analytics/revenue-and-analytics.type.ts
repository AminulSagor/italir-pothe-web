export type RevenueDatePreset =
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_month"
  | "this_year"
  | "all_time"
  | "custom";

export type RevenueGraphRange = "day" | "week" | "month";

export type RevenueSource = "all" | "course" | "package";

export type RevenueTransactionStatus = "all" | "successful" | "refunded";

export type RevenueSortOrder = "ASC" | "DESC";

export type RevenueTransactionSortBy =
  | "transactionAt"
  | "amount"
  | "orderNumber"
  | "userName"
  | "itemName";

export type CoursePerformanceSortBy =
  | "courseName"
  | "enrollments"
  | "sales"
  | "revenue"
  | "lastSaleAt";

export type PackagePerformanceSortBy =
  | "packageName"
  | "packageType"
  | "sales"
  | "revenue"
  | "lastSaleAt";

export type RevenueCourseStatus = "draft" | "published" | "archived";

export type RevenuePackageType = "ai_bundle" | "streak_freeze" | "cv_credit";

export type RevenuePackageStatus = "published" | "archived";

export type RevenueBillingModel = "one_time" | "monthly";

export interface RevenuePeriod {
  preset: RevenueDatePreset;
  from: string | null;
  to: string | null;
  previousFrom: string | null;
  previousTo: string | null;
}

export interface RevenueDateRangeQuery {
  preset?: RevenueDatePreset;
  from?: string;
  to?: string;
}

export interface RevenueMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface RevenueOverviewResponse {
  currency: "EUR";

  period: RevenuePeriod;

  cards: {
    totalLifetimeRevenue: {
      amount: string;
      periodChangePercentage: number;
    };

    revenueThisMonth: {
      amount: string;
      changePercentage: number;
    };

    courseRevenue: {
      amount: string;
      sales: number;
      percentageOfPeriodRevenue: number;
    };

    allPackagesRevenue: {
      amount: string;
      sales: number;
      percentageOfPeriodRevenue: number;
    };
  };

  selectedPeriodTotals: {
    courseRevenueEur: string;
    packageRevenueEur: string;
    totalRevenueEur: string;
    courseSales: number;
    packageSales: number;
    totalSales: number;
  };

  generatedAt: string;
  timezone: "UTC";
}

export interface RevenueGrowthPoint {
  bucketStart: string;
  label: string;
  courseRevenueEur: string;
  packageRevenueEur: string;
  totalRevenueEur: string;
  cumulativeRevenueEur: string;
  transactionCount: number;
}

export interface RevenueGrowthResponse {
  range: RevenueGraphRange;
  currency: "EUR";
  from: string;
  to: string;
  points: RevenueGrowthPoint[];

  totals: {
    revenueEur: string;
    transactions: number;
  };

  timezone: "UTC";
}

export interface RevenueGrowthQuery {
  range?: RevenueGraphRange;
}

export interface RevenueTransactionItem {
  id: string;

  source: Exclude<RevenueSource, "all">;

  orderNumber: string;

  user: {
    id: string;
    name: string;
    email: string | null;
    avatarUrl: string | null;
    deleted: boolean;
  };

  item: {
    id: string;
    name: string;
    type: string;
  };

  normalizedAmount: {
    currency: "EUR";
    amount: string;
  };

  chargedAmount: {
    currency: string;
    amount: string;
  };

  paymentProvider: string;

  status: Exclude<RevenueTransactionStatus, "all">;

  originalStatus: string;
  transactionAt: string;
}

export interface RevenueTransactionsQuery extends RevenueDateRangeQuery {
  page?: number;
  limit?: number;
  search?: string;
  source?: RevenueSource;
  status?: RevenueTransactionStatus;
  sortBy?: RevenueTransactionSortBy;
  sortOrder?: RevenueSortOrder;
}

export interface RevenueTransactionsResponse {
  items: RevenueTransactionItem[];

  meta: RevenueMeta;

  appliedFilters: {
    search: string | null;
    source: RevenueSource;
    status: RevenueTransactionStatus;
    sortBy: RevenueTransactionSortBy;
    sortOrder: RevenueSortOrder;
    period: RevenuePeriod;
  };
}

export interface RevenueAnalyticsSearchItem {
  id: string;
  name: string;
  subtitle: string | null;
  status: string;
  type: string;
}

export interface RevenueAnalyticsSearchResponse {
  search: string;
  courses: RevenueAnalyticsSearchItem[];
  packages: RevenueAnalyticsSearchItem[];
  transactions: RevenueTransactionItem[];
}

export interface CourseOverviewResponse {
  currency: "EUR";

  period: RevenuePeriod;

  cards: {
    totalCourseRevenue: {
      lifetimeAmount: string;
      periodAmount: string;
      changePercentage: number;
    };

    bestSellingCourse: {
      id: string;
      name: string;
      subtitle: string | null;
      sales: number;
      revenueEur: string;
    } | null;

    courseListing: {
      total: number;
      active: number;
    };
  };

  generatedAt: string;
}

export interface CoursePerformanceItem {
  courseId: string;
  courseName: string;
  subtitle: string | null;
  slug: string;
  status: RevenueCourseStatus;
  isFree: boolean;
  priceEur: string | null;
  enrollments: number;
  sales: number;
  currency: "EUR";
  revenueEur: string;
  lastSaleAt: string | null;
}

export interface CoursePerformanceQuery extends RevenueDateRangeQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: RevenueCourseStatus;
  sortBy?: CoursePerformanceSortBy;
  sortOrder?: RevenueSortOrder;
}

export interface CoursePerformanceResponse {
  items: CoursePerformanceItem[];

  meta: RevenueMeta;

  appliedFilters: {
    search: string | null;
    status: RevenueCourseStatus | null;
    sortBy: CoursePerformanceSortBy;
    sortOrder: RevenueSortOrder;
    period: RevenuePeriod;
  };
}

export interface PackageOverviewResponse {
  currency: "EUR";

  period: RevenuePeriod;

  cards: {
    totalPackageRevenue: {
      amount: string;
      periodChangePercentage: number;
    };

    revenueThisMonth: {
      amount: string;
      changePercentage: number;
    };

    courseRevenue: {
      amount: string;
    };

    packageRevenueInSelectedPeriod: {
      amount: string;
    };

    bestSeller: {
      id: string;
      name: string;
      packageType: RevenuePackageType;
      sales: number;
      revenueEur: string;
    } | null;
  };

  packageCounts: {
    total: number;
    published: number;
    archived: number;
  };

  generatedAt: string;
}

export interface PackagePerformanceItem {
  packageId: string;
  packageName: string;
  description: string | null;
  packageType: RevenuePackageType;
  status: RevenuePackageStatus;
  billingModel: RevenueBillingModel | null;
  sales: number;
  currency: "EUR";
  revenueEur: string;
  lastSaleAt: string | null;
}

export interface PackagePerformanceQuery extends RevenueDateRangeQuery {
  page?: number;
  limit?: number;
  search?: string;
  packageType?: RevenuePackageType;
  status?: RevenuePackageStatus;
  sortBy?: PackagePerformanceSortBy;
  sortOrder?: RevenueSortOrder;
}

export interface PackagePerformanceResponse {
  items: PackagePerformanceItem[];

  meta: RevenueMeta;

  appliedFilters: {
    search: string | null;
    packageType: RevenuePackageType | null;

    status: RevenuePackageStatus | null;

    sortBy: PackagePerformanceSortBy;
    sortOrder: RevenueSortOrder;
    period: RevenuePeriod;
  };
}
