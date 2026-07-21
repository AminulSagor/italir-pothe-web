export type ModerationReportStatus =
  | "pending"
  | "processing"
  | "resolved"
  | "banned";

export type ModerationActionType =
  | "formal_warning"
  | "permanent_ban"
  | "dismiss";

export interface ModerationReasonCount {
  reason: string;
  count: number;
}

export interface ModerationDashboardMetricsResponse {
  total_report_count: number;
  total_pending_count: number;
  pending_percentage_change: number;

  avg_response_time_minutes: number | null;
  response_time_percentage_change: number;

  resolved_today_count: number;
  resolved_today_percentage_change: number;

  status_counts: {
    pending: number;
    processing: number;
    resolved: number;
    banned: number;
  };

  reason_counts: ModerationReasonCount[];
}

export interface ModerationReportListItem {
  id: string;
  caseNumber: string;

  subjectName: string | null;
  subjectAvatarUrl: string | null;

  reporterName: string | null;

  contentType: string;
  contentEntityId: string;

  reportReason: string;
  submittedAt: string;

  status: ModerationReportStatus;
}

export interface ModerationReportsMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ModerationReportsResponse {
  items: ModerationReportListItem[];
  meta: ModerationReportsMeta;
}

export interface ModerationReportsQuery {
  page?: number;
  limit?: number;

  status?: ModerationReportStatus | "all";
  reason?: string;
  search?: string;
}

export interface ModerationReportOverview {
  id: string;
  caseNumber: string;

  status: ModerationReportStatus;
  submittedAt: string;

  reportReason: string;
  contentType: string;
  contentEntityId: string;
}

export interface ModerationReporterDetails {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;

  reporterNote: string | null;
  isDeleted: boolean;
}

export interface ModerationSubjectStats {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;

  is_banned: boolean;
  joinedAt: string | null;

  current_streak_days: number;
  total_xp: number;

  purchase_value_eur: string;
  isDeleted: boolean;
}

export interface ModerationSubjectCourse {
  courseId: string;
  title: string | null;
  status: string;
}

export interface ModerationVisualEvidence {
  id: string;
  fileId?: string | null;
  url: string | null;
  description: string | null;
  uploadedAt: string;
}

export interface ModerationActionHistoryItem {
  id: string;

  actionType: ModerationActionType | string;
  actionReason: string;

  moderatorName: string | null;
  loggedAt: string;
}

export interface ModerationReportDetailsResponse {
  report_overview: ModerationReportOverview;

  reporter_details: ModerationReporterDetails;

  subject_stats: ModerationSubjectStats;

  subject_courses: ModerationSubjectCourse[];

  visual_evidence: ModerationVisualEvidence[];

  action_history: ModerationActionHistoryItem[];
}

export interface PerformModerationActionPayload {
  action_type: ModerationActionType;
  action_reason: string;
}

export interface PerformModerationActionResponse {
  ok: boolean;

  reportId: string;
  caseNumber: string;

  status: ModerationReportStatus;
  notification: {
    created: boolean;
    sentCount: number;
  };
}
