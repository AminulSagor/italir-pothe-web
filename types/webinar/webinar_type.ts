export type WebinarApiStatus = "draft" | "scheduled" | "live" | "completed" | "cancelled";

export type WebinarDirectoryTab = "upcoming-scheduled" | "live-now" | "draft";

export type WebinarPublishType = "draft" | "schedule";

export interface WebinarAudienceSettings {
  isForAllUsers: boolean;
  courseIds: string[];
}

export interface WebinarItem {
  id: string;
  title: string;
  dateTime: string;
  hostTeacherName: string;
  thumbnailImageUrl: string | null;
  sendNotification: boolean;
  status: WebinarApiStatus;
  audienceSettings: WebinarAudienceSettings;
  createdByAdminId: string;
  updatedByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebinarPayload {
  title: string;
  dateTime: string;
  hostTeacherName: string;
  thumbnailImageUrl?: string | null;
  courseIds?: string[];
  sendNotification?: boolean;
  status?: "draft" | "scheduled";
}

export interface WebinarMutationResponse {
  message: string;
  webinar: WebinarItem;
}

export interface DeleteWebinarResponse {
  message: string;
  webinarId: string;
}

export interface WebinarPagination {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface WebinarListResponse {
  webinars: WebinarItem[];
  pagination: WebinarPagination;
}
