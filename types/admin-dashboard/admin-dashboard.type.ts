export type DashboardRevenueRange = "daily" | "weekly" | "monthly";

export type DashboardOrderSource = "all" | "course" | "package";

export type DashboardOrderStatus =
  | "all"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export type DashboardOrderSortBy =
  | "orderDate"
  | "amount"
  | "studentName"
  | "orderNumber";

export type DashboardSortOrder = "ASC" | "DESC";

export type DashboardOrdersView = "recent" | "all";

export interface AdminDashboardOverviewResponse {
  system: {
    status: "online";
    database: "connected";
    checkedAt: string;
  };

  currency: "EUR";

  cards: {
    monthlyRevenue: {
      amount: string;
      changePercentage: number;
      periodStart: string;
      periodEnd: string;
      comparisonStart: string;
      comparisonEnd: string;
    };

    totalStudents: {
      value: number;
      changePercentage: number;
      newThisMonth: number;
    };

    activeCourses: {
      value: number;
      changePercentage: number;
      publishedThisMonth: number;
    };

    newStudentSignups: {
      value: number;
      changePercentage: number;
      comparisonValue: number;
      periodStart: string;
      periodEnd: string;
      comparisonStart: string;
      comparisonEnd: string;
    };
  };

  generatedAt: string;
  timezone: "UTC";
}

export interface DashboardRevenueGrowthPoint {
  bucketStart: string;
  label: string;
  courseRevenueEur: string;
  packageRevenueEur: string;
  totalRevenueEur: string;
  cumulativeRevenueEur: string;
  purchaseCount: number;
}

export interface DashboardRevenueGrowthResponse {
  range: DashboardRevenueRange;
  currency: "EUR";

  bucketUnit: "hour" | "day" | "month";

  from: string;
  to: string;

  points: DashboardRevenueGrowthPoint[];

  totals: {
    revenueEur: string;
    purchases: number;
    firstBucketRevenueEur: string;
    lastBucketRevenueEur: string;
    changePercentage: number;
  };

  timezone: "UTC";
}

export interface DashboardOrderItem {
  id: string;

  source: Exclude<DashboardOrderSource, "all">;

  orderNumber: string;

  student: {
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
    amount: string;
    currency: "EUR";
  };

  chargedAmount: {
    amount: string;
    currency: string;
  } | null;

  paymentProvider: string | null;

  status: Exclude<DashboardOrderStatus, "all">;

  originalStatus: string;
  orderDate: string;
  createdAt: string;
  paidAt: string | null;
  refundedAt: string | null;
}

export interface DashboardRecentPurchasesResponse {
  items: DashboardOrderItem[];
  limit: 5;
  returned: number;
  generatedAt: string;
}

export interface DashboardOrdersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  from: number;
  to: number;
}

export interface DashboardOrdersResponse {
  items: DashboardOrderItem[];

  meta: DashboardOrdersMeta;

  appliedFilters: {
    search: string | null;
    status: DashboardOrderStatus;
    source: DashboardOrderSource;
    sortBy: DashboardOrderSortBy;
    sortOrder: DashboardSortOrder;
    from: string | null;
    to: string | null;
  };
}

export interface DashboardOrdersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: DashboardOrderStatus;
  source?: DashboardOrderSource;
  sortBy?: DashboardOrderSortBy;
  sortOrder?: DashboardSortOrder;
  from?: string;
  to?: string;
}

export type DashboardOrdersExportQuery = Omit<
  DashboardOrdersQuery,
  "page" | "limit"
>;
