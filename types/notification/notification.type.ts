export type NotificationPriority = "low" | "normal" | "high";

export type NotificationTargetType = "user" | "broadcast";

export interface NotificationUser {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: "user" | "admin";
  isVerified: boolean;
  isOnline?: boolean;
  lastSeenAt?: string | null;
}

export interface NotificationUserSearchResponse {
  items: NotificationUser[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface NotificationPayload {
  type?: "admin_message";
  title: string;
  body: string;
  deepLink?: string;
  imageFileId?: string;
  priority?: NotificationPriority;
}

export interface SendUserNotificationPayload extends NotificationPayload {
  userId: string;
}

export interface ScheduleNotificationPayload extends NotificationPayload {
  targetType: NotificationTargetType;
  userIds?: string[];
  scheduledAt: string;
}

export interface SendNotificationResponse {
  message: string;
  event: {
    id: string;
    title: string;
    body: string;
    imageFileId: string | null;
    targetType: NotificationTargetType;
    createdAt: string;
  };
  totalUsers: number;
  totalDevices?: number;
  sentCount?: number;
  failedCount?: number;
}

export type ScheduledNotificationStatus =
  | "scheduled"
  | "processing"
  | "sent"
  | "failed"
  | "cancelled";

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  type: "admin_message";
  priority: NotificationPriority;
  targetType: NotificationTargetType;
  userIds: string[] | null;
  deepLink: string | null;
  imageFileId: string | null;
  scheduledAt: string;
  status: ScheduledNotificationStatus;
  createdByAdminId: string | null;
  processingStartedAt: string | null;
  sentAt: string | null;
  cancelledAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleNotificationResponse {
  message: string;
  item: ScheduledNotification;
}
