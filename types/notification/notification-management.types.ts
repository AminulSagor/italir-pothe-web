import type { NotificationTargetType } from "./notification.type";

export type NotificationHistorySource =
  | "notification_event"
  | "scheduled_notification";

export type NotificationHistoryStatus =
  | "scheduled"
  | "processing"
  | "completed"
  | "sent"
  | "failed"
  | "cancelled";

export interface NotificationHistoryItem {
  id: string;
  source: NotificationHistorySource;

  title: string;
  body: string;

  imageFileId: string | null;
  imageUrl: string | null;

  targetType: NotificationTargetType;
  targetAudienceName: string;

  status: NotificationHistoryStatus;

  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;

  errorMessage: string | null;

  canDelete: boolean;

  sentCount?: number;
  failedCount?: number;
}

export interface NotificationHistoryStats {
  totalSent: number;
  scheduled: number;

  nextScheduled: {
    id: string;
    title: string;
    scheduledAt: string;
  } | null;
}

export interface NotificationHistoryMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationHistoryResponse {
  items: NotificationHistoryItem[];
  stats: NotificationHistoryStats;
  meta: NotificationHistoryMeta;
}

export interface NotificationHistoryQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DeleteScheduledNotificationResponse {
  message: string;
}
