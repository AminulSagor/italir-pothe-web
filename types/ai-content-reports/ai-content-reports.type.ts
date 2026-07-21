export type AiContentReportFeatureType =
  | "writing"
  | "talking"
  | "cv_builder";

export type AiContentReportIssue =
  | "offensive_or_hateful"
  | "sexual_or_inappropriate"
  | "dangerous_or_harmful"
  | "harassment"
  | "false_or_misleading"
  | "privacy_concern"
  | "other";

export type AiContentReportStatus =
  | "pending"
  | "reviewed"
  | "resolved"
  | "dismissed";

export interface AiContentReportReporter {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
}

export interface AiContentReportItem {
  id: string;
  reporterId: string;
  reporter: AiContentReportReporter;

  featureType: AiContentReportFeatureType;
  issue: AiContentReportIssue;
  details: string | null;

  sourceReference: string | null;
  messageReference: string | null;

  aiContentText: string | null;
  aiContentFileId: string | null;
  aiContentFileUrl: string | null;
  aiContentUrl: string | null;

  screenshotFileId: string | null;
  screenshotUrl: string | null;

  clientReportId: string | null;
  status: AiContentReportStatus;

  adminNote: string | null;
  reviewedByAdminId: string | null;
  reviewedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface AiContentReportsResponse {
  items: AiContentReportItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AiContentReportsQuery {
  page?: number;
  limit?: number;
  status?: AiContentReportStatus | "all";
  featureType?: AiContentReportFeatureType | "all";
  search?: string;
}

export interface UpdateAiContentReportStatusPayload {
  status: AiContentReportStatus;
  adminNote?: string;
}
