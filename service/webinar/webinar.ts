import { serviceClient } from "@/service/base/service_client";
import type {
  DeleteWebinarResponse,
  WebinarListResponse,
  WebinarMutationResponse,
  WebinarPayload,
} from "@/types/webinar/webinar_type";

const buildPaginationQuery = (page: number, limit: number) =>
  `page=${page}&limit=${limit}`;

export const getMyUpcomingWebinars = (page = 1, limit = 10) =>
  serviceClient.get<WebinarListResponse>(
    `/admin/webinars/my-upcoming?${buildPaginationQuery(page, limit)}`,
  );

export const getMyDraftWebinars = (page = 1, limit = 10) =>
  serviceClient.get<WebinarListResponse>(
    `/admin/webinars/my-drafts?${buildPaginationQuery(page, limit)}`,
  );

export const createWebinar = (payload: WebinarPayload) =>
  serviceClient.post<WebinarMutationResponse>("/admin/webinars", payload);

export const updateWebinar = (webinarId: string, payload: WebinarPayload) =>
  serviceClient.patch<WebinarMutationResponse>(
    `/admin/webinars/${webinarId}`,
    payload,
  );

export const deleteWebinar = (webinarId: string) =>
  serviceClient.delete<DeleteWebinarResponse>(`/admin/webinars/${webinarId}`);
