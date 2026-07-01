export type AdminUserAccessTier = "free" | "premium_pro";

export type AdminUserAccessFilter = "all" | "free" | "premium_pro";

export type AdminUserAccountStatusFilter = "all" | "active" | "restricted";

export type AdminUserDirectorySortBy =
  | "name"
  | "joinedAt"
  | "accessTier"
  | "totalXp"
  | "lastActivityAt";

export type AdminUserExamSortBy = "completedAt" | "score" | "title";

export type AdminUserCourseSortBy =
  | "enrolledAt"
  | "progress"
  | "title"
  | "lastActivityAt";

export type AdminUserGrowthRange = "day" | "week" | "month";

export type AdminUserSortOrder = "ASC" | "DESC";

export interface AdminUserDirectoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AdminUserSummaryMetric {
  value: number;
  changePercent: number;
  comparisonPeriod: string;
}

export interface AdminUserDashboardResponse {
  totalUsers: AdminUserSummaryMetric;

  activeThisMonth: AdminUserSummaryMetric;

  premiumProUsers: {
    count: number;
    percentage: number;
  };

  newSignupsToday: AdminUserSummaryMetric;

  generatedAt: string;
  timezone: "UTC";
}

export interface AdminUserGrowthPoint {
  bucketStart: string;
  bucketEnd: string;
  label: string;
  newUsers: number;
  totalUsers: number;
}

export interface AdminUserGrowthResponse {
  range: AdminUserGrowthRange;
  periodStart: string;
  periodEnd: string;
  usersBeforePeriod: number;
  newUsers: number;
  totalUsersAtEnd: number;
  points: AdminUserGrowthPoint[];
  timezone: "UTC";
}

export interface AdminUserDirectoryItem {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  profilePhotoFileId: string | null;
  joinedAt: string;

  accessTier: AdminUserAccessTier;

  accountStatus: "active" | "restricted";

  isRestricted: boolean;
  totalXp: number;
  lastActivityAt: string | null;
}

export interface AdminUserDirectoryResponse {
  items: AdminUserDirectoryItem[];

  meta: AdminUserDirectoryMeta;

  appliedFilters: {
    search: string | null;
    accessTier: AdminUserAccessFilter;
    accountStatus: AdminUserAccountStatusFilter;
    sortBy: AdminUserDirectorySortBy;
    sortOrder: AdminUserSortOrder;
  };
}

export interface AdminUserDirectoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  accessTier?: AdminUserAccessFilter;
  accountStatus?: AdminUserAccountStatusFilter;
  sortBy?: AdminUserDirectorySortBy;
  sortOrder?: AdminUserSortOrder;
}

export interface AdminUserGrowthQuery {
  range?: AdminUserGrowthRange;
}

export interface AdminUserExamResultItem {
  attemptId: string;
  referenceCode: string;
  title: string;
  courseId: string;
  courseTitle: string;
  levelLabel: string | null;
  scorePercent: number;
  verdict: string;
  status: string;
  submittedAt: string | null;
  completedAt: string | null;
}

export interface AdminUserExamResultsResponse {
  items: AdminUserExamResultItem[];
  meta: AdminUserDirectoryMeta;
}

export interface AdminUserExamResultsQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: AdminUserExamSortBy;
  sortOrder?: AdminUserSortOrder;
}

export interface AdminUserCourseItem {
  enrollmentId: string;

  enrollmentSource: "commerce" | "legacy";

  courseId: string;
  title: string;
  subtitle: string | null;
  isFree: boolean;
  enrollmentStatus: string;
  enrolledAt: string;
  completionPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastActivityAt: string | null;
}

export interface AdminUserCoursesResponse {
  items: AdminUserCourseItem[];
  meta: AdminUserDirectoryMeta;
}

export interface AdminUserCoursesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: AdminUserCourseSortBy;
  sortOrder?: AdminUserSortOrder;
}

export interface AdminUserActivityDay {
  date: string;
  durationSeconds: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface AdminUserActivityTypeBreakdown {
  activityType: string;
  durationSeconds: number;
  durationMinutes: number;
  percentage: number;
}

export interface AdminUserActivityAnalyticsResponse {
  range: {
    days: number;
    startDate: string;
    endDate: string;
  };

  currentStreakDays: number;
  longestStreakDays: number;

  totalSeconds: number;
  totalHours: number;

  rangeTotalSeconds: number;
  rangeTotalHours: number;

  activeDays: number;
  averageMinutesPerActiveDay: number;
  maxDailyDurationSeconds: number;

  days: AdminUserActivityDay[];

  activityTypeBreakdown: AdminUserActivityTypeBreakdown[];
}

export interface AdminUserDetailsResponse {
  user: {
    id: string;
    fullName: string;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    profilePhotoFileId: string | null;
    joinedAt: string;

    accessTier: AdminUserAccessTier;

    totalXp: number;
    currentStreakDays: number;
    longestStreakDays: number;
    isRestricted: boolean;

    accountStatus: "active" | "restricted";

    isVerified: boolean;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
  };

  examResults: AdminUserExamResultsResponse;

  enrolledCourses: AdminUserCoursesResponse;

  activityAnalytics: AdminUserActivityAnalyticsResponse;

  actions: {
    giftReward: {
      configurationEndpoint: string;
      createEndpoint: string;
    };

    message: {
      endpoint: "/chat/direct";
      method: "POST";

      body: {
        otherUserId: string;
      };
    };

    restriction: {
      endpoint: string;
      method: "PATCH";

      nextAction: "restrict" | "restore";
    };
  };
}

export interface AdminUserActivityQuery {
  days?: number;
}

export interface UpdateAdminUserRestrictionPayload {
  isBanned: boolean;
}

export interface QuickRestrictUserPayload {
  identifier: string;
}

export interface AdminUserRestrictionResponse {
  changed: boolean;
  message: string;

  user: {
    id: string;
    fullName: string;
    isBanned: boolean;

    accountStatus: "active" | "restricted";
  };
}

export interface DirectChatResponse {
  id?: string;
  chatId?: string;
  conversationId?: string;
  message?: string;
}
