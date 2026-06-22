import type {
  DeleteScheduledNotificationResponse,
  NotificationHistoryItem,
  NotificationHistoryQuery,
  NotificationHistoryResponse,
} from "@/types/notification/notification-management.types";
import type {
  NotificationPayload,
  NotificationUserSearchResponse,
  ScheduleNotificationPayload,
  ScheduleNotificationResponse,
  SendNotificationResponse,
  SendUserNotificationPayload,
} from "@/types/notification/notification.type";

import { serviceClient } from "../base/service_client";

export const searchNotificationUsers = (
  query: string,
  page = 1,
  perPage = 10,
) => {
  const params = new URLSearchParams({
    q: query.trim(),
    page: String(page),
    perPage: String(perPage),
  });

  return serviceClient.get<NotificationUserSearchResponse>(
    `/users/search/name?${params.toString()}`,
  );
};

export const sendBroadcastNotification = (payload: NotificationPayload) =>
  serviceClient.post<SendNotificationResponse>(
    "/admin/notifications/broadcast",
    payload,
  );

export const sendUserNotification = (payload: SendUserNotificationPayload) =>
  serviceClient.post<SendNotificationResponse>(
    "/admin/notifications/user",
    payload,
  );

export const scheduleNotification = (payload: ScheduleNotificationPayload) =>
  serviceClient.post<ScheduleNotificationResponse>(
    "/admin/notifications/schedule",
    payload,
  );

export const getNotificationHistory = (
  query: NotificationHistoryQuery = {},
) => {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 10),
  });

  const cleanSearch = query.search?.trim();

  if (cleanSearch) {
    params.set("search", cleanSearch);
  }

  return serviceClient.get<NotificationHistoryResponse>(
    `/admin/notifications/history?${params.toString()}`,
  );
};

export const getNotificationHistoryItem = (id: string) =>
  serviceClient.get<NotificationHistoryItem>(
    `/admin/notifications/history/${id}`,
  );

export const deleteScheduledNotification = (id: string) =>
  serviceClient.delete<DeleteScheduledNotificationResponse>(
    `/admin/notifications/scheduled/${id}`,
  );
